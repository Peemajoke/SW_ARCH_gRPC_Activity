const dotenv = require('dotenv')
const PROTO_PATH="./restaurant.proto";
const connectDB = require('../config/db')
const menuModel = require('./models/Menu')

dotenv.config({path:'./config/.env'})
connectDB()

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH,{
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

var restaurantProto =grpc.loadPackageDefinition(packageDefinition);

const {v4: uuidv4}=require("uuid");

const server = new grpc.Server();
// const menu=[
//     {
//         id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
//         name: "Tomyam Gung",
//         price: 500
//     },
//     {
//         id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
//         name: "Somtam",
//         price: 60
//     },
//     {
//         id: "8551887c-f82d-4e44-88ca-ae2a1ccc92b7",
//         name: "Pad-Thai",
//         price: 120
//     }
// ];

server.addService(restaurantProto.RestaurantService.service,{
    getAllMenu: async (_,callback)=>{
        const menus = await menuModel.find()
        callback(null, {menu: menus});
    },
    get: async (call,callback)=>{
        let menuItem = await menuModel.findById(call.request.id)

        if(menuItem) {
            callback(null, menuItem);
        }else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },
    insert: async (call, callback)=>{
        let menuItem=call.request;

        menuItem.id=uuidv4();
        await menuModel.create(menuItem)
        callback(null,menuItem);
    },
    update: async (call,callback)=>{
        // let existingMenuItem = menu.find(n=>n.id==call.request.id);
        let existingMenuItem = await menuModel.findById(call.request.id)

        if(existingMenuItem){
            existingMenuItem.name=call.request.name;
            existingMenuItem.price=call.request.price;
            await menuModel.findByIdAndUpdate(call.request.id,existingMenuItem,{
                new: true, 
                runValidators:true
            })
            callback(null,existingMenuItem);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not Found"
            });
        }
    },
    remove: async (call, callback) => {
        // let existingMenuItemIndex = menu.findIndex(n=>n.id==call.request.id);
        let existingMenuItem = await menuModel.findById(call.request.id)

        if(existingMenuItem){
            existingMenuItem.remove()
            callback(null,{});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "NOT Found"
            });
        }
    }
});

server.bind("127.0.0.1:30043",grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:30043");
server.start();