const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const todoRoutes = express.Router();
var morgan = require('morgan')
let Todo = require('./todo.model');
require('dotenv').config();
const DB = require('./db');
const multer = require('multer');
const swagger = require('./swagger')
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// cb(null, __dirname+'/../static/')
		cb(null, 'data/')
	},
	filename: function (req, file, cb) {
		const fileExt = (file.originalname.split('.'))[1]
		cb(null, `${file.fieldname}-${Date.now()}.${fileExt}`)
	}
})

const fileUpload = multer({
	// dest: '../static/',
	dest: './data/',
	// storage,
	// onFileUploadStart: function (file) {
	// 	console.log(file.originalname + ' is starting ...')
	// },
})
const app = express();

app.use(morgan('combined'))

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res, next) => {

	res.json({
		msg: "HELLO WORLD"
	});
})
app.use(swagger)

todoRoutes.route('/').get(async (req, res, next) => {
	try {
		const data = await Todo.find();
		res.json(data)
	} catch (e) {
		next(e);
	}
});

todoRoutes.route('/:id').get(async (req, res, next) => {
	try {
		const id = req.params.id;
		const todo = await Todo.findById(id)
		res.json(todo)
	} catch (e) {
		next(e);
	}
});
todoRoutes.route('/').post(fileUpload.single('file'), async (req, res, next) => {
	try {
		console.log(req.file)
		const todo = new Todo(req.body);
		const data = await todo.save()
		res.json(data)
	} catch (e) {
		next(e);
		throw new Error(`todos create error: ${e}`)
	}
});

todoRoutes.route('/:id').put(async (req, res, next) => {
	try {
		const updated = await Todo.findByIdAndUpdate(req.params.id, req.body)
		res.json(updated);

	} catch (e) {
		next(e)
		throw new Error(`todos update error: ${e}`)
	}
});

app.use('/todos', todoRoutes);
app.use('/status', (req, res, next) => {

	res.json({
		msg: "OK"
	});
})

let cachedDB = null;

async function init() {
	// Setup MongoDB
	if (cachedDB && cachedDB.serverConfig.isConnected()) {
		console.log('using cached database instance');
		Promise.resolve(cachedDB);
	} else {
		const db = new DB();
		console.log('creating new Db connection');
		cachedDB = db.connect();
	}

	const PORT = process.env.PORT || 5000
	app.listen(PORT, () => {
		console.log("Server is running on port " + PORT);
	});
	
}

init()

module.exports = app;