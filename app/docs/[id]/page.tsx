import {
    DocsPage,
    DocsTitle,
} from 'fumadocs-ui/page';
import {getPageInfo, notion, notionCustom} from "@/lib/notion";
import {Renderer} from "@/app/docs/[id]/renderer";
import {notFound} from "next/navigation";
import {PageObjectResponse} from "@notionhq/client/build/src/api-endpoints";
import {cache} from 'react';

const getPage = cache(async (id: string) => {
    const recordMap = await notionCustom.getPage(id)

    return recordMap as typeof recordMap & {
        raw: {
            page: PageObjectResponse
        }
    }
})

export default async function Page(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const recordMap = await getPage(params.id).catch(() => {
        notFound()
    })

    const page = recordMap.raw.page
    const info = getPageInfo(page)

    return (
        <DocsPage tableOfContent={{enabled: false}} tableOfContentPopover={{enabled: false}}>
            <DocsTitle>{info.title}</DocsTitle>
            <Renderer className='!m-0 !px-0 !w-full' recordMap={recordMap}/>
        </DocsPage>
    );
}

export async function generateStaticParams() {
    const response = await notion.search(({
        filter: {
            value: 'page',
            property: 'object'
        }
    }))

    return response.results.map(page => ({
        id: page.id
    }))
}

export async function generateMetadata(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const page = await getPage(params.id).catch(() => notFound())
    const info = getPageInfo(page.raw.page)

    return {
        title: info.title,
    };
}

/*
it isn't simple to re-create a block renderer in React for Notion blocks
We skip it for now

function Block({children}: { children: BlockObjectResponse[] }) {

    return children.map((child) => {
        const key = child.id

        if (child.type.startsWith('heading_')) {
            // @ts-expect-error -- get heading
            const info = child[child.type]

            return <Heading key={key} as={`h${child.type.slice('heading_'.length)}` as 'h1'}>
                <RichText color={info.color}>{info.rich_text}</RichText>
            </Heading>
        }

        if (child.type === 'paragraph') {
            return <p key={key}>
                <RichText color={child.paragraph.color}>{child.paragraph.rich_text}</RichText>
            </p>
        }

        if (child.type === 'link_preview') {
            return <Link href={child.link_preview.url}>{child.link_preview.url}</Link>
        }

        if (child.type === 'table') {
            child.has_children
        }
    })
}

function RichText({children}: {color: string, children: RichTextItemResponse[] }) {
    return children.map(v => v.plain_text).join()
}
 */