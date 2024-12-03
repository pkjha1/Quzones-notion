import {DocsPage, DocsTitle} from "fumadocs-ui/page";
import {getPageInfo, getPageUrl, notion} from "@/lib/notion";
import {Card, Cards} from "fumadocs-ui/components/card";
import {DatabaseObjectResponse, PageObjectResponse} from "@notionhq/client/build/src/api-endpoints";

export default async function Page() {
    const response = await notion.search({})

    return <DocsPage tableOfContent={{enabled: false}} tableOfContentPopover={{enabled: false}}>
        <DocsTitle>Index</DocsTitle>
        <Cards>
            {(response.results as (PageObjectResponse | DatabaseObjectResponse)[]).map((item) => {
                if (item.object === 'database') return
                const info = getPageInfo(item)

                return <Card key={item.id} href={getPageUrl(item)} title={info.title}/>
            })}
        </Cards>
    </DocsPage>
}