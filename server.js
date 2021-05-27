let express = require("express")
let app = express()
const PORT = process.env.PORT || 3000
let path = require("path")
app.use(express.static("static"))
var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())


app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))
})

let last = []
let array = []
app.post("/polling", async function(req, res) {
    res.czasPrzyjscia = new Date().getTime()
    console.log(res)
    array.push(res)
})

app.post("/sentNewMessage", function(req, res) {

    let hours = new Date().getHours()
    let minutes = new Date().getMinutes()
    if (hours < 10) {
        hours = "0" + hours
    }
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    last = `<span class="godzina">[${hours}:${minutes}]</span><span class="nick" style="color: ${req.body.color};">&#60${req.body.nick}&#62</span> <span class="message">${req.body.message}</span>`

    for (let i = 0; i < array.length; i++) {
        array[i].send(last)
    }
    array.length = 0
    res.end()
})

app.listen(PORT, function() {
    console.log("start serwera na porcie 3000")
})


check()
async function check() {
    while (true) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        if (array.length > 0) {
            array.forEach(res => {
                if (new Date().getTime() - res.czasPrzyjscia > 10000) {
                    res.end()
                    let index = array.indexOf(res)
                    array.splice(index, 1)
                }
            });
        }
    }

}