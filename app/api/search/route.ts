import {SortedResult} from "fumadocs-core/server";
import {NextRequest, NextResponse} from "next/server";
import {getPageInfo, getPageUrl, notion} from "@/lib/notion";
import {PageObjectResponse} from "@notionhq/client/build/src/api-endpoints";

export async function GET(req: NextRequest): Promise<NextResponse<SortedResult[]>> {
    const query = req.nextUrl.searchParams.get('query') ?? ''

    const result = await notion.search({
        query,
        filter: {
            value: 'page',
            property: 'object'
        }
    })

    const sorted: SortedResult[] = (result.results as PageObjectResponse[]).map(obj => {
        const info = getPageInfo(obj)

        return ({
            type: 'page',
            id: obj.id,
            content: info.title,
            url: getPageUrl(obj)
        })
    })

    return NextResponse.json(sorted)
}
