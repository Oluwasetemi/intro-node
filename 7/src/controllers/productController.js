/* eslint-disable no-shadow */
const product = require('../models/product');
// const { hash } = require('../util/helpers');
// const { send } = require('../util/mail');

exports.productPage = (req, res) => {
  res.render('product.ejs');
};

// exports.product = (req, res) => {
//   res.send('myproduct');
// };

exports.product = async (req, res) => {
  try {
    // console.log(req.body);
    
    const { productId, productName, quantity, barcode, userId, description, image } = req.body;
        
    const createdProduct = await product.create({
      productId,
      productName,
      quantity,
      barcode,
      userId,
      description,
      image
    });

    // console.log(createdUser);

    if (!createdProduct) {
      res.send('Error: Product could not be created');
    }

    // await send({
    //   filename: 'welcome-to-adefam',
    //   to: createdUser.email,
    //   subject: 'Registration Successful',
    //   name: createdUser.firstName
    // });
   
    res.render('dashboard.ejs', {
        firstName: 'adefam'
            
    });
} catch (error) {
    console.log(error.message);
    res.send('Error: Email did not sent');
  }
};

// exports.dashboard = (req, res) => {
    //   const { product } = res.locals;
//   res.render('dashboard', { firstName: product.firstName });
// };

exports.getProduct = async (req, res) => {
    try{
        const productDetail = await product.findAll(); //Sequelize Select Query
       
        // execute query
        res.render('dashboard.ejs', {firstName: 'adefam', productDetail}); //Pass FirstName and produdctDetail to the dashboard
    }
    catch (error) {
            console.log(error.message);
    }
            
    };
    
exports.viewProductPage = async (req, res) => {
  try {
    const { productId } = req.params;

  //   console.log(productId);

  if (!productId) {
    res.send('Error. You must pass an Product Id');
  }
  //   // console.log(productDetail);
    const proDetails = await product.findOne({
      where: {
        productId
      }
    });
    
    if(!proDetails) {
      res.send('Error. Product details not find')
    }

    res.render('viewProductPage.ejs', { 
      productId,
      product: proDetails
      // ,message: ''
    });
  } catch (error) {
    console.log(error.message);
  }
};



exports.editProduct = async (req, res) => {

    let productId = req.params.productId;
    let productName = req.body.productName;
    let quantity = req.body.quantity;
    let barcode = req.body.barcode;
    let userId = req.body.userId;
    let description = req.body.description;
    
    await product.update({ 
        // lastName: "Doe",
        // productId,
      productName,
      quantity,
    //   barcode,
      userId,
      description
    //   image 
    }, {
        where: {
          productId: productId
        }
      });

      res.render('edit-product.ejs', {
        // product: proDetails
        // message: ''
    });

    // let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "' WHERE `players`.`id` = '" + playerId + "'";
    // db.query(query, (err, result) => {
    //     if (err) {
    //         return res.status(500).send(err);
    //     }
    //     res.redirect('/');
    // });
}