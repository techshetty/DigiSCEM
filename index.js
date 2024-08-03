const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Ticket = require('./models/ticket');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'))

const mongoUri = '';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB cluster'))
    .catch(err => console.error('Could not connect to MongoDB cluster', err));
app.get('/status', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'status.html'));
    });
app.get('/redeem', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'redeem.html'));
    });
    app.get('/redeemqr', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'red_cam.html'));
    });
app.post('/generate-ticket', async (req, res) => {
    const ticket = new Ticket({ id: req.body.id, item: req.body.item.toLowerCase()});
    try {
        await ticket.save();
        res.status(201).send(ticket);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post('/redeem-ticket', async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ id: req.body.id });
        if (!ticket) {
            return res.status(404).json({
                msg: "Ticket not found"
            });
        }
        if (ticket.redeemed) {
            return res.status(400).json({
                item: ticket.item,
                msg: 'Ticket already redeemed',
                alr: true,
            });
        }
        ticket.redeemed = true;
        await ticket.save();
        res.status(200).json({
            msg: "Ticket Redeemed Successfully",
            item: ticket.item,
            alr:false,
        });
    } catch (error) {
        res.status(400).send(error);
    }
});
app.post('/ticket-status', async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ id: req.body.id });
        if (!ticket) {
            return res.status(404).json({
                inv:true,
                msg: "Ticket not found"
            });
        }
        if (ticket.redeemed) {
            return res.status(400).json({
                inv:false,
                item:ticket.item,
                red:true,
                msg: 'Ticket already redeemed'});
        }
        if(ticket&&!ticket.redeemed){
            return res.status(201).json({inv:false,red:false,msg:'Ticket is active',item:ticket.item});
        }}
            catch (error) {
                res.status(400).send(error);
            }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
