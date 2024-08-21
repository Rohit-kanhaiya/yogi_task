var express = require("express");
var exe = require("./../connection");
var router = express.Router();
var checkLogin = (req, res, next) => {
    if (req.session.admin_register_id === undefined) {
        res.redirect("/admin/login");
    } else {
        next();
    }
};
router.get("/login",function(req,res){
    res.render("admin/login.ejs");
})
router.get("/",checkLogin,function(req,res){
    res.render("admin/home.ejs");
});



router.get("/add_category",checkLogin,function(req,res){
    res.render("admin/manage_product_category.ejs");
});
router.post("/save_manage_product_category",checkLogin,async function(req,res){
    const d=req.body;
    if(req.files.category_image)
    {
            var category_image = new Date().getTime() + req.files.category_image.name;
            req.files.category_image.mv('public/uploads/'+ category_image);
    }
    const sql=`insert into category(category_name,category_sequence,category_image)values('${d.category_name}','${d.category_sequence}','${category_image}')`
    const data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/category_list");
})
router.get("/category_list",checkLogin,async function(req,res){
    const category_info=await exe(`select * from category`);
    const obj={"category_info":category_info}
    res.render("admin/category_list.ejs",obj)
});
router.post("/login_account",async function(req,res){
   const d=req.body
    var sql=`select * from admin_register where admin_email='${d.admin_email}' AND admin_password='${d.admin_password}'`;
    var data=await exe(sql);
    if(data.length>0)
    {
        req.session['admin_register_id']=data[0].admin_register_id;
        res.redirect("/admin/");
    }else
    {
        res.redirect("/admin/login");
    }

});

router.get("/edit_category/:category_id", async function(req, res) {
    const category_id = req.params.category_id;
        const category_info = await exe(`SELECT * FROM category WHERE category_id = ${category_id}`);
        if (category_info.length > 0) {
            const obj = { "category_info": category_info[0] };
            res.render("admin/edit_category.ejs", obj);      
    }
});
router.post("/update_category",async function(req,res){
    // res.send(req.body)
    const d=req.body;
    if (req.files && req.files.category_image) {
        const category_image = new Date().getTime() + req.files.category_image.name;
        req.files.category_image.mv('public/uploads/'+ category_image);
        const data = await exe(`update category set category_image='${category_image}' where category_id='${d.category_id}'`);
    }
    const data2 = await exe(`UPDATE category SET category_name='${d.category_name}',category_sequence='${d.category_sequence}',category_status='${d.category_status}' WHERE category_id  ='${d.category_id}'`);
    // res.send(data2)
    res.redirect("/admin/category_list");
});
router.get("/delete_category/:category_id",async function(req,res){
    const id=req.params.category_id;
    const sql = await exe(`DELETE FROM category WHERE category_id = '${id}'`);
    res.redirect("/admin/category_list");
});
router.get("/add_subcategory",checkLogin,async function(req,res){
    const category_info=await exe(`select * from category`);
    const obj={"category_info":category_info}
    res.render("admin/add_subcategory.ejs",obj);
});
router.post("/add_subcategory",async function(req,res){
    const d=req.body;
    if(req.files.subcategory_image)
    {
            var subcategory_image = new Date().getTime() + req.files.subcategory_image.name;
            req.files.subcategory_image.mv('public/uploads/'+ subcategory_image);
    }
    const sql=`insert into subcategory(category_name,subcategory_name,subcategory_sequence,subcategory_image)values('${d.category_name}','${d.subcategory_name}','${d.subcategory_sequence}','${subcategory_image}')`;
    const data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/subcategory_list");
});
router.get("/subcategory_list",checkLogin,async function(req,res){
    const subcategory_info=await exe(`select * from subcategory`);
    const obj={"subcategory_info":subcategory_info}
    res.render("admin/subcategory_list.ejs",obj)
});
router.get("/edit_subcategory/:subcategory_id", async function(req, res) {
    const subcategory_id = req.params.subcategory_id;
        const category_info = await exe(`SELECT * FROM category`);
        const subcategory_info = await exe(`SELECT * FROM subcategory WHERE subcategory_id = ${subcategory_id}`);
        if (subcategory_info.length > 0) {
            const obj = {
                "subcategory_info": subcategory_info[0],
                "category_info": category_info
            };
            res.render("admin/edit_subcategory.ejs", obj);
        } 
});

router.post("/update_subcategory",async function(req,res){
    // res.send(req.body)
    const d=req.body;
    if (req.files && req.files.subcategory_image) {
        const subcategory_image = new Date().getTime() + req.files.subcategory_image.name;
        req.files.subcategory_image.mv('public/uploads/'+ subcategory_image);
        const data = await exe(`update subcategory set subcategory_image='${subcategory_image}' where subcategory_id='${d.subcategory_id}'`);
    }
    const data2 = await exe(`UPDATE subcategory SET category_name='${d.category_name}', subcategory_name='${d.subcategory_name}',subcategory_sequence='${d.subcategory_sequence}',subcategory_status='${d.subcategory_status}' WHERE subcategory_id='${d.subcategory_id}'`);
    res.redirect("/admin/subcategory_list");
});
router.get("/delete_subcategory/:subcategory_id",async function(req,res){
    const id=req.params.subcategory_id;
    const sql = await exe(`DELETE FROM subcategory WHERE subcategory_id = '${id}'`);
    res.redirect("/admin/subcategory_list");

});
router.get("/add_product",checkLogin,async function(req,res){
    const category_info=await exe(`select * from category`);
    const subcategory_info=await exe(`select * from subcategory`);
    const obj={"subcategory_info":subcategory_info,"category_info":category_info};
    res.render("admin/add_product.ejs",obj);
});
router.post("/add_product",async function(req,res){
    // res.send(req.body)
    const d=req.body;
    if(req.files.product_image)
    {
            var product_image = new Date().getTime() + req.files.product_image.name;
            req.files.product_image.mv('public/uploads/'+ product_image);
    }
    const sql = `INSERT INTO product (category_name,subcategory_name,product_name,product_image) VALUES ('${d.category_name}','${d.subcategory_name}','${d.product_name}','${product_image}')`;
    const data=await exe(sql);
    res.redirect("/admin/product_list");
});
router.get("/product_list",checkLogin,async function(req,res){
    const product_info=await exe(`select * from product`)
    const obj={"product_info":product_info}
    res.render("admin/product_list.ejs",obj);
});
router.get("/edit_product/:product_id", async function(req, res) {
    const product_id = req.params.product_id;
        const category_info = await exe(`SELECT * FROM category`);
        const subcategory_info = await exe(`SELECT * FROM subcategory`);
        const product_info = await exe(`SELECT * FROM product WHERE product_id = ${product_id}`);
        if (product_info.length > 0) {
            const obj = {
                "category_info": category_info,
                "subcategory_info": subcategory_info,
                "product_info": product_info[0]
            };
            res.render("admin/edit_product.ejs", obj);
        } 
});

router.post("/update_product",async function(req,res){
    // res.send(req.body)
    const d=req.body;
    if (req.files && req.files.product_image) {
        const product_image = new Date().getTime() + req.files.product_image.name;
        req.files.product_image.mv('public/uploads/'+ product_image);
        const data = await exe(`update product set product_image='${product_image}' where product_id='${d.product_id}'`);
    }
    const data2 = await exe(`UPDATE product SET category_name='${d.category_name}', subcategory_name='${d.subcategory_name}',product_name='${d.product_name}',product_status='${d.product_status}' WHERE product_id='${d.product_id}'`);
res.redirect("/admin/product_list");
});
router.get("/delete_product/:product_id",async function(req,res){
const id=req.params.product_id;
const pro_data_delete=await exe(`DELETE FROM product WHERE product_id = '${id}'`)
res.redirect("/admin/product_list");
});
router.get("/logout",function (req, res, next)  {
    if (req.session) {
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/admin/login');
        }
   });
}
});
router.get("/forgot_password",async function(req,res){
    res.render("admin/forgot_password.ejs");
});
router.post("/change_password",async function(req,res){
    const d=req.body
    var sql=`select * from admin_register where admin_security_code='${d.admin_security_code}'`;
    var data=await exe(sql);
    if(data.length>0)
    {
       const sql=await exe(`UPDATE admin_register SET admin_password='${d.admin_password}' WHERE admin_register_id ='1'`);
     res.redirect("/admin/login");
    }else
    {
        res.redirect("/admin/forgot_password");
    }
})
module.exports = router;