const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to be able to get readable data from the body

let users = [
    { id: 1, name: 'Ryu', age: 32, country: 'Japón' },
    { id: 2, name: 'Chun-Li', age: 29, country: 'China' },
    { id: 3, name: 'Guile', age: 35, country: 'Estados Unidos' },
    { id: 4, name: 'Dhalsim', age: 45, country: 'India' },
    { id: 5, name: 'Blanka', age: 32, country: 'Brasil' },
];

app.get('/users', (req, res) => {
    res.json(users); 
});

app.get('/users/:name', (req, res) => {
    const user = users.find(user => user.name.toLowerCase() === req.params.name.toLowerCase());
    if (!user) {
        res.status(404).json({ message: 'User not found' });
    } else {
        res.json(user);
    };
});

app.get('/', (req, res) => {
    res.send(`
        <h1>Users API:</h1>
        <ul>
            ${users.map((users) => `<li>ID: ${users.id} | Name: ${users.name} | Age: ${users.age} | Country: ${users.country}</li>`).join('')}
        </ul>
        <form action="/users" method="post">
            <input type="text" name="name" placeholder="Name" required>
            <input type="number" name="age" placeholder="Age" required>
            <input type="text" name="country" placeholder="Country" required>
            <br><br>
            <button type="submit">Add user</button>
        </form>
        <a href="/users">Users JSON</a>
    `);
});

app.post('/users', (req, res) => {
    const {name, age, country} = req.body;
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        age: req.body.age,
        country: req.body.country
    };
    users.push(newUser);
    res.redirect('/');
});


app.put('/users/:name', (req, res) => {
    const i = users.findIndex(user => user.name.toLowerCase() === req.params.name.toLowerCase());
    if (i !== -1) {
        users[i] = {
            ...users[i],
            ...req.body
        };
        res.json(users[i]);
    } else {
        res.status(404).json({message: 'User not found'});
    };
});

app.delete('/users/:name', (req, res) => {
    const userExists = users.some(user => user.name.toLowerCase() === req.params.name.toLowerCase());
    if (userExists) {
        users = users.filter(user => user.name.toLowerCase() !== req.params.name.toLowerCase());
        res.json({message:'User deleted'});
    } else {
        res.status(404).json({message: 'User not found to be deleted'});
    }
})


app.listen(3000, () => {
    console.log('Server is running on port: http://localhost:3000');
});