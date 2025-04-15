const { wrap, configure } = require('agentql')
const { chromium } = require('playwright')
require('dotenv').config()

const queryMap = async () => {
    // Configure the AgentQL API key
    configure({
        apiKey: process.env.AGENTQL_API_KEY,
    })

    // Launch a headless browser using Playwright.
    const browser = await chromium.launch({ headless: false })

    // Create a new page in the browser and wrap it to get access to the AgentQL's querying API
    const page = await wrap(await browser.newPage())
    await page.goto('https://www.google.com/maps')

    const elements = await page.queryElements(`{ search_box }`)
    await elements.search_box.type("'plumbing' inurl:business.site santa rosa")
    await elements.search_box.press('Enter')

    const data = await page.queryData(`{
      business[] {
        name
        website_url
        address
        rating
        review_count
        service_type
      }
    }`)

    console.log(data)
}

;(async () => {
    await queryMap()
})()
