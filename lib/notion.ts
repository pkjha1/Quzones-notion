import {Client} from "@notionhq/client"
import {PageObjectResponse, RichTextItemResponse} from "@notionhq/client/build/src/api-endpoints";
import {NotionCompatAPI} from "notion-compat";

const apiKey = process.env.NOTION_API_KEY

export const notion = new Client({auth: apiKey})

/**
 * Non-official client used for react-notion-x
 */
export const notionCustom = new NotionCompatAPI(notion)

export interface PageInfo {
    title: string
}

export function getPageInfo(page: PageObjectResponse): PageInfo {
    const info: PageInfo = {title: 'unknown'}
    const keys = Object.keys(page.properties)

    for (const key of keys) {
        if (page.properties[key].type === 'title') {
            info.title = getPlainText(page.properties[key].title)
        }
    }

    return info
}

export function getPlainText(rich: RichTextItemResponse[]): string {
    return rich.map(v => v.plain_text).join()
}

export function getPageUrl(page: PageObjectResponse) {
    return `/docs/${page.id}`
}