import {DocsLayout} from 'fumadocs-ui/layouts/docs';
import type {ReactNode} from 'react';
import {baseOptions} from '@/app/layout.config';
import 'react-notion-x/src/styles.css'
import {getPageInfo, getPageUrl, getPlainText, notion} from "@/lib/notion";
import {PageTree} from "fumadocs-core/server"
import {structuredClone} from "next/dist/compiled/@edge-runtime/primitives";
import {DatabaseObjectResponse, PageObjectResponse, SearchResponse} from "@notionhq/client/build/src/api-endpoints";

export const revalidate = false

export default async function Layout({children}: { children: ReactNode }) {
    const response = await notion.search({})

    return (
        <DocsLayout tree={buildPageTree(response)} {...baseOptions}>
            {children}
        </DocsLayout>
    );
}

function buildPageTree(response: SearchResponse) {
    const root: PageTree.Root = {
        name: 'Docs',
        children: []
    }
    const idToNode = new Map<string, PageTree.Item | PageTree.Folder>()
    const pending: {
        parent: string
        node: PageTree.Folder | PageTree.Item
    }[] = []

    for (const item of response.results) {
        let parentId = 'workspace'

        if ('parent' in item) {
            if (item.parent.type === 'database_id') {
                parentId = item.parent.database_id
            }

            if (item.parent.type === 'page_id') {
                parentId = item.parent.page_id
            }
        }

        if (item.object === 'database') {
            const db = item as DatabaseObjectResponse
            const node: PageTree.Folder = {
                type: 'folder',
                name: getPlainText(db.title),
                children: []
            }

            idToNode.set(db.id, node)
            pending.push({
                parent: parentId,
                node
            })
            continue;
        }

        const page = item as PageObjectResponse
        const info = getPageInfo(page)
        const node: PageTree.Item = {
            name: info.title,
            type: 'page',
            url: getPageUrl(page)
        }

        idToNode.set(page.id, node)
        pending.push({
            parent: parentId,
            node
        })
    }

    for (const item of pending) {
        const parent = item.parent === 'workspace' ? undefined : idToNode.get(item.parent)

        if (!parent) {
            root.children.push(item.node)
            continue
        }

        // convert to folder if necessary
        if (parent.type === 'page') {
            Object.assign(parent, {
                type: 'folder',
                name: parent.name,
                index: structuredClone(parent),
                children: []
            } satisfies PageTree.Folder)
        }

        const parentFolder = parent as PageTree.Folder
        parentFolder.children.push(item.node)
    }

    return root
}