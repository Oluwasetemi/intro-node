const fs = require('fs');
/* eslint-disable no-shadow */
const Product = require('../models/product');

exports.productPage = async (req, res) => {
  const { user } = res.locals;

  const countProduct = await Product.count({
    where: {
      userId: user.username,
    },
  });

  if (user.type === 'user' && countProduct === 5) {
    req.flash(
      'error',
      "You've exceeded product limit, move to Premium plan or delete some of your product"
    );
    return res.redirect('/dashboard');
  }

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

    const countProduct = await Product.count({
      where: {
        userId: user.username,
      },
    });

    // console.log('UserId', countProduct);

    const {
      productId,
      productName,
      location,
      categories,
      // quantity,
      price,
      discount,
      // userId,
      description,
    } = req.body;

    // if (discount < 0 || discount < 100) {
    //   req.flash('error', 'Discount must be between 0% - 100%');
    //   return res.redirect('/products');
    // }
    // console.log(user.type);

    if (user.type === 'user' && countProduct === 5) {
      req.flash(
        'error',
        "You've exceeded product limit, move to Premium plan or delete some of your product"
      );
      return res.redirect('/dashboard');
    }
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

        const createdProduct = await Product.create({
          productId,
          productName,
          location,
          categories,
          // quantity,
          price,
          discount,
          userId: user.username,
          description,
          image,
        });

        // console.log(createdProduct);

        if (!createdProduct) {
          req.flash('error', 'Product Could not be Created');
          // res.send('Error: Product could not be created');
        } else {
          const productDetail = await Product.findAll();
          // const { user } = res.locals;
          console.log(res.locals.product);
          req.flash('success', 'Product Created successfully');
          return res.render('product.ejs', {
            users: user,
            // firstName: req.user.firstName,
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
    res.send('Error:Error in creating a product');
  }
};

// Fetch for all product and pass it to dashboard page
exports.getProduct = async (req, res) => {
  try {
    const { user } = res.locals;
    if (user.type === 'admin') {
      const page = req.params.pageNumber || 1;
      const limit = 20;
      const skip = page * limit - limit;
      const totalCount = Product.count({});

      const productDetail = Product.findAll({
        offset: skip,
        limit,
        order: [['createdAt', 'DESC']],
      }); // Sequelize Select Query

      const [total, productData] = await Promise.all([
        totalCount,
        productDetail,
      ]);

      const pages = Math.ceil(total / limit);

      if (!pages) {
        return res.render('viewProduct.ejs', {
          productDetail: productData,
          total,
          page,
          pages,
          users: user,
        });
      }

      if (page > pages) {
        req.flash(
          'error',
          `You requested for page ${page}, but that doesn't exist so I will put you on page ${pages}`
        );
        res.redirect(`product/page/${pages}`);
        // res.redirect(`/`);
        return;
      }
      // execute query
      res.render('viewProduct.ejs', {
        productDetail: productData,
        total,
        page,
        pages,
        users: user,
      }); // Pass FirstName and produdctDetail to the dashboard
    } else {
      const productData = await Product.findAll({
        where: {
          userId: user.username,
        },
        order: [['createdAt', 'DESC']],
      });

      res.render('viewProduct.ejs', {
        productDetail: productData,
        users: user,
      });
    }
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
      return res.send('Error. You must pass a product Id');
    }

    // Find a product base on product Id using Sequelize query.
    const proDetails = await Product.findOne({
      where: {
        productId,
      },
    });

    if (!proDetails) {
      return res.send('Error. Product details not find');
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
      const {
        productName,
        location,
        categories,
        price,
        discount,
        userId,
        description,
      } = req.body;
      
      // Update The Product Record
      const updateProduct = await Product.update(
        {
          // lastName: "Doe",
          productId,
          productName,
          location,
          categories,
          price,
          discount,
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

      const proDetails = await Product.findOne({
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
      const {
        productName,
        location,
        categories,
        price,
        discount,
        description,
      } = req.body;
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
          const updateProduct = await Product.update(
            {
              // lastName: "Doe",
              productId,
              productName,
              location,
              categories,
              price,
              discount,
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
            return res.send("Error: Product can't be Updated");
          }

          const proDetails = await Product.findOne({
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
        // return res.render('viewProductPage.ejs', {
        //   users: user,
        //   // product: proDetails,
        // });
        return res.redirect(`/product/${productId}`);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Delete Product from database
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    console.log(productId);
    if (!productId) {
      res.send('Error. You must pass a Product Id');
    }

    const deleteImage = await Product.findOne({
      where: {
        productId,
      },
    });

    const { image } = deleteImage;

    console.log(image);

    const deleteProduct = await Product.destroy({
      where: {
        productId,
      },
    });

    if (deleteProduct) {
      fs.unlink(`src/public/img/${image}`, async err => {
        if (err) {
          return res.status(500).send(err);
        }

        res.redirect('/productByUser');
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
    const limit = 20;
    const skip = page * limit - limit;
    const totalCount = Product.count({});
    const { user } = res.locals;

    const productDetail = Product.findAll({
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
    }); // Sequelize Select Query

    const [total, productData] = await Promise.all([totalCount, productDetail]);

    const pages = Math.ceil(total / limit);

    if (!pages) {
      return res.render('display.ejs', {
        // firstName: 'adefam',
        productDetail: productData,
        total,
        page,
        pages,
        users: user,
      });
    }

    if (page > pages) {
      req.flash(
        'error',
        `You requested for page ${page}, but that doesn't exist so I will put you on page ${pages}`
      );
      res.redirect(`product/page/${pages}`);
      // res.redirect(`/`);
      return;
    }
    // execute query
    res.render('display.ejs', {
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

// Fetch for all product and pass it to dashboard page
/* exports.getProduct = async (req, res) => {
  try {
    const page = req.params.pageNumber || 1;
    const limit = 5;
    const skip = page * limit - limit;
    const totalCount = Product.count({});
    const { user } = res.locals;

    // console.log(req.user.firstName);

    const productDetail = Product.findAll({
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
}; */
