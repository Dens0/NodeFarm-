const fs = require("fs")
const http = require('http')
const url = require('url')

const slugify = require('slugify')

const replaceTemplate = require('./modules/replaceTemplate')


console.log(slugify('Fresh Avocados', {lower: true}))
//FILES
//blocking sync way
// fs.readFile('txt\\stadrt.txt', 'utf-8', ((err, data1) => {
//     if (err)return console.log(err.syscall)
//     fs.readFile(`txt\\${data1}.txt`, 'utf-8', ((err, data2) => {
//         console.log(data2)
//         fs.readFile(`txt\\append.txt`, 'utf-8', ((err, data3) => {
//             console.log(data3)
//             fs.writeFile('txt\\final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log("Your file has been written")
//             })
//
//         }))
//
//     }))
// }))
//
// console.log('Reading file...')

//non-blocking async way

// SERVER

const tempOoverview = fs.readFileSync('templates\\template_overview.html', 'utf-8')
const tempCard = fs.readFileSync('templates\\template_card.html', 'utf-8')
const tempProduct = fs.readFileSync('templates\\template_product.html', 'utf-8')
const data = fs.readFileSync('dev-data\\data.json', 'utf-8')
const dataObj = JSON.parse(data)

const slugs = dataObj.map(el => slugify(el.productName, {lower: true, replacement: '/*/'}))
console.log(slugs)

const server = http.createServer((req, res) => {
    // console.log(req.url)
    const {query, pathname} = url.parse(req.url, true)

// OVERVIEV
    if (pathname === '/overview' || pathname === '/') {
        res.writeHead(200, {'Content-type': 'text/html'})


        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        const output = tempOoverview.replace(/{%PRODUCT_CARD%}/g, cardsHtml)
        // console.log(cardsHtml)

        res.end(output)

// PRODUCT  PAGE
    } else if (pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'})

        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
// API
    } else if (pathname === '/api') {
        fs.readFile("dev-data\\data.json", 'utf-8', (err, data) => {
            res.writeHead(200, {'Content-type': 'application/json'})
            res.end(data)

        })
    } else {
// NOT FOUND
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-ow-header': 'hello world'
        })

        res.end("<h1>page not found</h1>")
    }
})


server.listen(8000, '127.0.0.1', () => {
    console.log("Listening to request on port 8000")
})
