const fs = require('fs');
/* eslint-disable no-shadow */
const product = require('../models/product');

exports.productPage = (req, res) => {
  const { user } = res.locals;
  res.render('product.ejs', {
    users: user,
  });
};

// Create Product and redirect to Dashboard using Sequelize
exports.product = async (req, res) => {
  try {
    const { user } = res.locals;
    if (!req.files) {
      req.flash('error', 'No files were uploaded');
      return res.status(400).send('No files were uploaded.');
    }

    const {
      productId,
      productName,
      quantity,
      barcode,
      userId,
      description,
    } = req.body;

    const uploadedFile = req.files.image;
    let image = uploadedFile.name;

    const fileExtension = uploadedFile.mimetype.split('/')[1];
    image = `${productId}.${fileExtension}`;

    // console.log('Images:', image);
    // console.log(uploadedFile.mimetype);

    if (
      uploadedFile.mimetype === 'image/png' ||
      uploadedFile.mimetype === 'image/jpeg' ||
      uploadedFile.mimetype === 'image/gif'
    ) {
      // upload the file to the /public/img directory
      uploadedFile.mv(`./src/public/img/${image}`, async err => {
        if (err) {
          console.log('Errror:', err.message);
          return res.status(500).send(err);
        }

        const createdProduct = await product.create({
          productId,
          productName,
          quantity,
          barcode,
          userId,
          description,
          image,
        });

        // console.log(createdProduct);

        if (!createdProduct) {
          req.flash('error', 'Product Could not be Created');
          // res.send('Error: Product could not be created');
        } else {
          // await send({
          //   filename: 'welcome-to-adefam',
          //   to: createdUser.email,
          //   subject: 'Registration Successful',
          //   name: createdUser.firstName
          // });

          const productDetail = await product.findAll();
          // const { user } = res.locals;
          console.log(res.locals.product);
          req.flash('success', 'Product Created successfully');
          return res.render('home.ejs', {
            users: user,
            firstName: req.user.firstName,
            ...res.locals.products.dataValues,
            productDetail,
          });
        }
      });
    } else {
      req.flash(
        'error',
        "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed."
      );
      return res.render('product.ejs', {
        users: user,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.send('Error: Email did not sent');
  }
};

// Fetch for all product and pass it to dashboard page
exports.getProduct = async (req, res) => {
  try {
    const page = req.params.pageNumber || 1;
    const limit = 5;
    const skip = page * limit - limit;
    const totalCount = product.count({});
    const { user } = res.locals;

    // console.log(req.user.firstName);

    const productDetail = product.findAll({
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
    }); // Sequelize Select Query

    const [total, productData] = await Promise.all([totalCount, productDetail]);

    const pages = Math.ceil(total / limit);

    if (pages === 0) {
      res.send('No products Still');
      return;
    }
    if (page > pages) {
      req.flash(
        'error',
        `You requested for page ${page}, but that doesn't exist so I will put you on page ${pages}`
      );
      res.render('dashboard.ejs', {
        firstName: req.user.firstName,
        productDetail: productData,
        total,
        page,
        pages,
        users: user,
      }); // Pass FirstName and produdctDetail to the dashboard
      return;
    }
    // execute query
    res.render('dashboard.ejs', {
      firstName: req.user.firstName,
      productDetail: productData,
      total,
      page,
      pages,
      users: user,
    }); // Pass FirstName and produdctDetail to the dashboard
  } catch (error) {
    console.log(error.message);
  }
};

// Fetch product based on product Id and pass it to view page for update.
exports.viewProductPage = async (req, res) => {
  try {
    const { productId } = req.params; // Get product Id from the database
    const { user } = res.locals;
    if (!productId) {
      res.send('Error. You must pass a product Id');
    }

    // Find a product base on product Id using Sequelize query.
    const proDetails = await product.findOne({
      where: {
        productId,
      },
    });

    if (!proDetails) {
      res.send('Error. Product details not find');
    }

    res.render('viewProductPage.ejs', {
      productId,
      product: proDetails,
      users: user,
      // ,message: ''
    });
  } catch (error) {
    console.log(error.message);
  }
};

// Update fetched product
exports.editProduct = async (req, res) => {
  try {
    const { user } = res.locals;
    if (!req.files) {
      const { productId } = req.params;
      const { productName } = req.body;
      const { quantity } = req.body;
      const { barcode } = req.body;
      const { userId } = req.body;
      const { description } = req.body;

      // Update The Product Record
      const updateProduct = await product.update(
        {
          // lastName: "Doe",
          productId,
          productName,
          quantity,
          barcode,
          userId,
          description,
        },
        {
          where: {
            productId,
          },
        }
      );

      console.log(updateProduct);

      if (!updateProduct) {
        res.send("Error: Product can't be Updated");
      }

      const proDetails = await product.findOne({
        where: {
          productId,
        },
      });

      req.flash('success', 'Record Updated Successfully');
      res.render('viewProductPage.ejs', {
        product: proDetails,
        users: user,
        // message: ''
      });
    } else {
      const { productId } = req.params;
      const { productName } = req.body;
      const { quantity } = req.body;
      const { barcode } = req.body;
      const { userId } = req.body;
      const { description } = req.body;
      const uploadedFile = req.files.image;

      let image = uploadedFile.name;

      const fileExtension = uploadedFile.mimetype.split('/')[1];

      image = `${productId}.${fileExtension}`;

      if (
        uploadedFile.mimetype === 'image/png' ||
        uploadedFile.mimetype === 'image/jpeg' ||
        uploadedFile.mimetype === 'image/gif'
      ) {
        // upload the file to the /public/img directory
        uploadedFile.mv(`./src/public/img/${image}`, async err => {
          if (err) {
            console.log('Errror:', err.message);
            return res.status(500).send(err);
          }
          // Update The Product Record
          const updateProduct = await product.update(
            {
              // lastName: "Doe",
              productId,
              productName,
              quantity,
              barcode,
              userId,
              description,
              image,
            },
            {
              where: {
                productId,
              },
            }
          );

         if (!updateProduct) {
            res.send("Error: Product can't be Updated");
          }

          const proDetails = await product.findOne({
            where: {
              productId,
            },
          });

          req.flash('success', 'Record Updated Successfully');
          res.render('viewProductPage.ejs', {
            product: proDetails,
            users: user,
            // message: ''
          });
        });
      } else {
        req.flash(
          'error',
          "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed."
        );
        return res.render('viewProductPage.ejs', {
          users: user,
          // product: proDetails,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Delete Product from database
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    console.log(productId);
    if (!productId) {
      res.send('Error. You must pass a Product Id');
    }

    const deleteImage = await product.findOne({
      where: {
        productId,
      },
    });

    const { image } = deleteImage;

    console.log(image);

    const deleteProduct = await product.destroy({
      where: {
        productId,
      },
    });

    if (deleteProduct) {
      fs.unlink(`src/public/img/${image}`, async err => {
        if (err) {
          return res.status(500).send(err);
        }

        console.log(deleteProduct);
        res.redirect('/dashboard');
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Fetch for all product and pass it to dashboard page
exports.displayProduct = async (req, res) => {
  try {
    const page = req.params.pageNumber || 1;
    const limit = 8;
    const skip = page * limit - limit;
    const totalCount = product.count({});
    const { user } = res.locals;

    const productDetail = product.findAll({
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
    }); // Sequelize Select Query

    const [total, productData] = await Promise.all([totalCount, productDetail]);

    const pages = Math.ceil(total / limit);

    if (page > pages) {
      req.flash(
        'error',
        `You requested for page ${page}, but that doesn't exist so I will put you on page ${pages}`
      );
      res.redirect(`product/page/${pages}`);
      return;
    }
    // execute query
    res.render('display.ejs', {
      // firstName: 'adefam',
      productDetail: productData,
      total,
      page,
      pages,
      users: user,
    }); // Pass FirstName and produdctDetail to the dashboard
  } catch (error) {
    console.log(error.message);
  }
};
