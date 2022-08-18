---
title: 'Node.js rest api using mysql and sequelize orm'
metaTitle: 'Node.js rest api using mysql and sequelize orm'
metaDesc: 'We will create rest api using sequelize orm and mysql database usin exress.js'
socialImage: images/sequelize.png
date: '2022-08-16'
tags:
  - nodejs
  - sequelize
  - express.js
  - mysql
  - orm
  - rest api
---
# Rest Api with Node.js
Today we will learn how to create rest api using nodejs.We will follow the best practices to implement this task. So have patience and read carefully.If it feels overwhelming at first don't worry all your confusions will be cleared in summary section. Things we need to implement that:
- mysql (database)
- sequelize (orm)
- express.js

What we'll be building:

- Read data from database
- Create new data.
- Update existing data.
- delete existing data.

## Step 1: Create Project:
First, we create a folder using these command

```js
$ mkdir restapi
$ cd restapi
```

We need to install necessary modules: express, sequelize, mysql2 and cors.
Run the command:

```js
npm install express sequelize mysql2 cors swagger-autogen swagger-ui-express --save
```
Here,
- Express is for building the Rest apis
- Sequelize for using orm instead of writing raw sql.
- mysql2 is to connect with database
- cors provides Express middleware to enable CORS with various options.
- Swagger for api documentation.

We will use babel to so that we can write modern javascript code.

### What is Babel?
Babel is a JavaScript compiler. It's a popular tool that helps you use the newest features of the JavaScript programming language.

### Why use Babel in Node.js?
Have you ever opened a back end repo built with Node.js/Express – and the very first thing you saw was the ES6 import and export statements along with some other cool ES6 syntax features?

Well, Babel made all that possible. Remember that Babel is a popular tool that lets you use the newest features of JavaScript. And many frameworks today use Babel under the hood to compile their code.

For example, Node can't use ES6 import and export statements and some other cool features of ES6 syntax without the help of a compiler like Babel.

So in this tutorial, I'll show you how to quickly setup your Node app to be compatible with most ES6 syntax.

### How to setup babel?

Install babel packages using npm command.

```js
npm install --save-dev @babel/cli @babel/core @babel/preset-env
```

Ok now we are ready for phase two.

## Step 2: Connecting With Database.

We need `dotenv` package to use environment variables so that database credentials can remain hidden.let's install that,

```js
npm install dotenv
```

Now we will create a `.env` file in root folder .

```js

DATABASE_ENVIROMENT=development
DATABASE_DIALECT="mysql"

DATABASE_DEVELOPMENT_USERNAME="root"
DATABASE_DEVELOPMENT_PASSWORD="admin"
DATABASE_DEVELOPMENT_DATABASE="demodb"
DATABASE_DEVELOPMENT_HOST="localhost"
```
Now , we will create database config file `config.js`
```js
require('dotenv').config();
module.exports = {
  
    "development": {
      "username": process.env.DATABASE_DEVELOPMENT_USERNAME,
      "password": process.env.DATABASE_DEVELOPMENT_PASSWORD,
      "database": process.env.DATABASE_DEVELOPMENT_DATABASE,
      "host": process.env.DATABASE_DEVELOPMENT_HOST,
      "dialect": process.env.DATABASE_DIALECT
    }
};
```


Now we will ,create root file app.js 
```js
import express from 'express';
import cors from  'cors';
import regeneratorruntime from 'regenerator-runtime';
import db from './models/index.js'
import routes from './routes/index';
import swaggerUi from 'swagger-ui-express';

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const swaggerDocument = require('./swagger.json'); 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  db.sequelize.authenticate()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Sequelize Rest Api." });
});

app.use(routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

```

## Step 3: Sequelize ORM

We will cover seeding ,migration ,models.Just like how we use Git to version control source code, we use migrations and seeders to manage the state of our database schemas.

Let's create models 
```js
npx sequelize-cli model:create --name Video
npx sequelize-cli model:create --name Category
```
### Video.js model:
```js
export default (sequelize, Sequelize) => {
  const Video = sequelize.define("Video", {
    video_id   : {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,

    },
    order :{
      type: Sequelize.INTEGER,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate:{
        notEmpty: true
      }
    },
    avg_sessiontime: {
      type: Sequelize.TIME,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate:{
        notEmpty: true
      }
    },
    video_duration: {
      type: Sequelize.TIME,
      allowNull: false,
      validate:{
        notEmpty: true
      }
    },
    video_url: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
       notEmpty: true
      }
    }
  });

  return Video;
};

```
### Category.js model:
```js
export default (sequelize, Sequelize) => {
  const Category = sequelize.define("categories", {
    category_id  : {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,

    },
    category:  {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'video must have a category' },
        notEmpty: { msg: 'category must not be empty' },
      }
    }
  });

  return Category;
};

```
### index.js model:
```js
require('dotenv').config();
import video from './video';
import category from './category';
import Sequelize from 'sequelize';
import sequelizeConfig from '../config/db_config';

const conf = sequelizeConfig[process.env.DATABASE_ENVIROMENT];

const sequelize = new Sequelize(conf.database,conf.username, conf.password, {
  host: conf.host,
  dialect:conf.dialect,
  operatorsAliases: false,

  pool: {
    max: 40,
    min: 0,
    acquire: 10000,
    idle: 60000
  }
});

const db={};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.video = video(sequelize, Sequelize);
db.category = category(sequelize, Sequelize);

db.category.hasMany(db.video, {
  foreignKey: 'category_id',
  as :'video'
})

db.video.belongsTo(db.category, {
  foreignKey: 'category_id',
  as :'categories'
})

export default db;

```

### Let's create migration files to create the tables in database.

```js
npx sequelize-cli migration:generate --name video
npx sequelize-cli migration:generate --name category
```
### video.js
```js
'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('videos', {
      video_id   : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order :{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
          notEmpty: true
        }
      },
      avg_sessiontime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate:{
          notEmpty: true
        }
      },
      video_duration: {
        type: Sequelize.TIME,
        allowNull: false
      },
      video_url: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
          notEmpty: true
        }
      },
      createdAt:{
       type: Sequelize.DATE,
      },
      updatedAt:{
        type: Sequelize.DATE,
      }

     });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('videos');
  }
};

```

### category.js
```js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      category_id   : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate:{
          notEmpty: true
        }
      },
  
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categories');
  }
};
```

### Let's create seeding files 
```js
npx sequelize-cli seed:generate --name add-videos
npx sequelize-cli seed:generate --name add-categories
```
### add-videos.js
```js
'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('videos', [{
      "title": "C# Tutorial For Beginners",
      
      "order": 1,
      "avg_sessiontime": "00:20:00",
      "description": "C# Tutorial For Beginners - Learn C# Basics in 1 Hour",
      "video_duration": "01:10:32",
      "video_url": "https://www.youtube.com/watch?v=gfkTfcpWqAY",
      "category_id": 1,
      "updatedAt": "2022-07-20 04:01:27",
      "createdAt": "2022-07-20 04:01:27"
       },
       {
        "order": 2,
        "title": "Python for Beginners",
        "avg_sessiontime": "00:20:00",
        "description": "Python for Beginners - Learn Python in 1 Hour",
        "video_duration": "01:00:05",
        "video_url": "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        "category_id": 1,
        "createdAt": "2022-07-20 04:01:27",
        "updatedAt": "2022-07-20 04:01:27"
       },{
        "order": 3,
        "title": "JavaScript Tutorial for Beginners",
        "avg_sessiontime": "00:20:00",
        "description": "JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour",
        "video_duration": "00:48:16",
        "video_url": "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        "category_id": 1,
        "createdAt": "2022-07-20 04:01:27",
        "updatedAt": "2022-07-20 04:01:27"
       },
       {
        "order": 1,
        "title": "Angular Tutorial for Beginners: Learn Angular & TypeScript",
        "avg_sessiontime": "00:20:00",
        "description": "Angular tutorial for beginners: Learn Angular & TypeScript from scratch. ",
        "video_duration": "02:02:41",
        "video_url": "https://www.youtube.com/watch?v=k5E2AVpwsko",
        "category_id": 2,
        "createdAt": "2022-07-20 04:01:27",
        "updatedAt": "2022-07-20 04:01:27"
       },
       {
        "order": 2,
        "title": "React JS - React Tutorial for Beginners",
        "avg_sessiontime": "00:20:00",
        "description": "React JS Tutorial - Get up & running with React JS: the most popular JavaScript library in the world! ",
        "video_duration": "02:25:25",
        "video_url": "https://www.youtube.com/watch?v=Ke90Tje7VS0",
        "category_id": 2,
        "createdAt": "2022-07-20 04:01:27",
        "updatedAt": "2022-07-20 04:01:27"
      }

      ], {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('videos', null, {  });
  }
};
```

### add-category.js

```js
'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('categories', [{
      "category": "programming",
      "updatedAt": "2022-07-20 04:01:27",
      "createdAt": "2022-07-20 04:01:27"
     },{
      "category": "web-development",
      "updatedAt": "2022-07-20 04:01:27",
      "createdAt": "2022-07-20 04:01:27"
     }

     ], {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('categories', null, {  });
  }
};

```

### For creating asssociation

```js
'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return queryInterface.addColumn(
      'videos', // name of Source model
      'category_id', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'categories', // name of Target model
          key: 'category_id' //, // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return queryInterface.removeColumn(
      'videos', // name of Source model
      'category_id', // name of the key we're want to remove
    );
  }
  
};

```

Finally run these command to create the tables.

```js
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
```
Finally run these command to fill the tables with data.
```js
npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo:all
```

Now we are ready for final phase.

#Step 4: Business logics of api creation
We will divide the task in two sections services will handle database and orm related tasks and controllers will redirect them based on action.

### video controller.js

```js
import db from "../models/index.js";
import videoservice from "../services/video_service";
import categoryservice from "../services/category_service";

const Op = db.Sequelize.Op;

class VideoController {
  async create(req, res) {
    // #swagger.description = 'Create new video...'
    try {
      const category = req.body.category;
      const categoryid = await categoryservice.addnewCategory(category);
      const order = await videoservice.getOrderCount(categoryid);

      const video = {
        title: req.body.title,
        order: order,
        avg_sessiontime: req.body.avg_sessiontime,
        description: req.body.description,
        video_duration: req.body.video_duration,
        video_url: req.body.video_url,
        category_id: categoryid,
      };

      const status = await videoservice.addVideo(video);
      res.status(201).send(status);
    } catch (e) {
      if (e.name === "SequelizeValidationError") {
        return res
          .status(400)
          .send({ message: "Attribute Fields Cannot Be Empty." });
      } else res.status(400).send("Error while adding video");
    }
  }

  async findAll(req, res) {
    // #swagger.description = 'Get all videos...'
    /* #swagger.responses[200] = {
            description: 'List of all videos available',
            schema: { 
               $ref: '#/definitions/Video' 
            }     
        } 
        */
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    try {
      const status = await videoservice.findAllVideo(condition);
      res.status(200).send(status);
    } catch (e) {
      res.status(404).send("Error while getting videos");
    }
  }

  async findOne(req, res) {
    // #swagger.description = 'Find video by id(video_id)...'
    /* #swagger.responses[200] = {
            schema: { 
               $ref: '#/definitions/Video' 
            }     
        } 
        */
    const videoid = req.params.id;

    try {
      const status = await videoservice.findVideobyId(videoid);
      res.status(200).send(status);
    } catch (e) {
      res.status(404).send("Video not found");
    }
  }

  async update(req, res) {
    // #swagger.description = 'Update existing video by id(video_id)...'
    const videoid = req.params.id;
    let video = req.body;

    try {
      const status = await videoservice.updateVideo(videoid, video);
      res.status(200).send(status);
    } catch (e) {
      res.status(404).send({ message: "Video Not found." });
    }
  }

  async updateCategoryName(req, res) {
    // #swagger.description = 'Update video category(single) by id(video_id)...'
    const id = req.params.id;
    let category = req.body.category;

    const categoryId = await videoservice.findcategoryId(id);
    const newcategoryid = await categoryservice.addnewCategory(category);

    if (categoryId == newcategoryid) {
      res
        .status(204)
        .send({ message: "Category name is same as existing one." });
      return;
    }

    try {
      console.log(categoryId);
      const neworder = await videoservice.getOrderCount(newcategoryid);
      const status = await videoservice.updateCategoryName(
        id,
        newcategoryid,
        neworder,
        categoryId
      );
      res.status(200).send(status);
    } catch (e) {
      if (e.name === "SequelizeValidationError") {
        return res
          .status(400)
          .send({ message: "Category Name Cannot Be Empty." });
      } else {
        res.status(404).send("Video Category Cannot Be Updated");
      }
    }
  }

  async delete(req, res) {
    // #swagger.description = 'Delete existing video by id(video_id)...'
    const id = req.params.id;

    try {
      const status = await videoservice.deleteVideo(id);
      res.status(200).send(status);
    } catch (e) {
      res.status(404).send({ message: "Video not found!" });
    }
  }

  async deleteAll(req, res) {
    // #swagger.description = 'Delete all videos...'
    try {
      const status = await videoservice.deleteAllVideo();
      res.status(200).send({ message: "Videos were deleted successfully!" });
    } catch (e) {
      res.status(404).send({ message: "No video found!" });
    }
  }

  async reOrderByCategory(req, res) {
    // #swagger.description = 'Change video order in each category...'
    let order = req.params.order;
    let category = req.params.category;
    const categoryId = await categoryservice.findcategoryId(category);

    if (!categoryId) {
      res.status(404).send({ message: "Category doesn't exist!" });
      return;
    }

    let newOrder = req.params.neworder;

    const max = await videoservice.getOrderMax(categoryId);
    const min = await videoservice.getOrderMin(categoryId);

    if (order > max || order < min || newOrder > max || newOrder < min) {
      res.status(404).send({ message: "video order doesn't exist!" });
      return;
    }

    try {
      if (order == newOrder) {
        res.status(204).send({ message: "video is already in that order!" });
      } else if (order > newOrder) {
        const status = await videoservice.reOrderByCategoryInc(
          order,
          categoryId,
          newOrder
        );
        res.status(200).send(status);
      } else {
        const status = await videoservice.reOrderByCategoryDec(
          order,
          categoryId,
          newOrder
        );
        res.status(200).send(status);
      }
    } catch (e) {
      res.status(404).send({ message: "Error while updating order" });
    }
  }
}

export default new VideoController();

```

### category-controller.js

```js
import db from "../models/index.js";
import categoryservice from "../services/category_service";

const Op = db.Sequelize.Op;

class CategoryController {
  async create(req, res) {
    // #swagger.description = 'Create a new category...'
    const category = {
      category: req.body.category,
    };
    try {
      const status = await categoryservice.addCategory(category);
      res.status(201).send(status);
    } catch (e) {
      if (e.name === "SequelizeValidationError") {
        return res
          .status(400)
          .send({ message: "Attribute Fields Cannot Be Empty." });
      } else
        res
          .status(400)
          .send({ message: "Error while creating video category" });
    }
  }

  async findAll(req, res) {
    // #swagger.description = 'Find all existing category...'
    /* #swagger.responses[200] = {
            description: 'List of all categories available',
            schema: {
                
                  category : 'programming',
                  videos :  { $ref: '#/definitions/Video' }
            }     
        } */
    try {
      const status = await categoryservice.findAllVideo();
      res.status(200).send(status);
    } catch (e) {
      res.status(404).send({ message: "No video found!" });
    }
  }

  async findByCategory(req, res) {
    // #swagger.description = 'Find videos under a specific category...'
    /* #swagger.responses[200] = {
            description: 'List of all categories available',
            schema: {
                
                  category : 'programming',
                  videos :  { $ref: '#/definitions/Video' }
            }     
        } */
    const category = req.params.category;
    try {
      const status = await categoryservice.findVideoByCategory(category);
      res.status(200).send(status);
    } catch (e) {
      res.status(404).send({ message: "No video found!" });
    }
  }

  async updateCategoryName(req, res) {
    // #swagger.description = 'Update category name for all videos under same category...'
    try {
      const newCategory = req.body.category;
      const category = req.params.category;

      const find = await categoryservice.findcategoryId(category);
      if (!find) {
        res.status(404).send({ message: "No category found!" });
      } else {
        const status = await categoryservice.updateCategoryName(
          category,
          newCategory
        );
        res.status(200).send(status);
      }
    } catch (e) {
      if (e.name === "SequelizeValidationError") {
        return res
          .status(400)
          .send({ message: "Category Name Cannot Be Empty." });
      } else {
        res.status(404).send({ message: "Category Cannot Be Updated" });
      }
    }
  }

  async delete(req, res) {
    // #swagger.description = 'Delete category and all videos under that category...'
    const category = req.params.category;
    try {
      const status = await categoryservice.deleteCategory(category);
      res.status(200).send(status);
    } catch (e) {
      res.status(404).send({ message: "Category not found!" });
    }
  }
}

export default new CategoryController();

```

### video-service.js
```js
import e from "cors";
import db from "../models/index.js";
import globalValues from "../utils/global_values";
const Video = db.video;
const Category = db.category;
const resJson = globalValues.result;
const errJson = globalValues.error;
const Op = db.Sequelize.Op;
const seq = db.Sequelize;

class VideoService {
  async addVideo(video) {
    let finalRes = {};

    let res = await Video.create(video);

    return res;
  }

  async findAllVideo(condition) {
    let finalRes = {};
    let res = await Video.findAll({
      where: condition,
      attributes: {
        exclude: ["category_id", "createdAt", "updatedAt", "order"],
      },
      include: [
        {
          model: Category,
          as: "categories",
          attributes: ["category"],
        },
      ],
    });

    if (res.length > 0) finalRes[resJson] = res;
    else finalRes[resJson] = "No Video found.";

    return res;
  }

  async findVideobyId(videoid) {
    let res = await Video.findOne({
      where: { video_id: videoid },
      attributes: {
        exclude: ["category_id", "video_id", "createdAt", "updatedAt", "order"],
      },
      include: [
        {
          model: Category,
          as: "categories",
          attributes: ["category"],
        },
      ],
    });

    return res;
  }

  async updateVideo(videoid, video) {
    let res = await Video.findByPk(videoid);
    if (!res) {
      throw Error("Video not found!");
    }
    res.title = video.title || res.title;
    res.order = video.order || res.order;
    res.avg_sessiontime = video.avg_sessiontime || res.avg_sessiontime;
    res.description = video.description || res.description;
    res.video_duration = video.video_duration || res.video_duration;
    res.video_url = video.video_url || res.video_url;

    await res.save();
    return res;
  }

  async updateCategoryName(videoid, newcategoryid, neworder, categoryId) {
    let finalRes = {};
    const oldorder = await Video.findOne({
      attributes: ["order"],
      where: { video_id: videoid },
    });

    let res = await Video.update(
      {
        category_id: newcategoryid,
        order: neworder,
      },
      {
        where: { video_id: videoid },
      }
    );

    let updateorder = await Video.increment(
      {
        order: -1,
      },
      {
        where: {
          order: { [Op.gt]: oldorder.order },
          category_id: categoryId,
        },
      }
    );

    finalRes[resJson] = "Video category updated successfully";

    return finalRes;
  }
  async deleteVideo(id) {
    let finalRes = {};

    let res = await Video.findByPk(id);

    if (!res) {
      throw Error("Video not found!");
    }
    await res.destroy({ truncate: true, restartIdentity: true });

    return res;
  }

  async deleteAllVideo() {
    let finalRes = {};
    let check = await Video.count();

    if (check > 0) {
      let res = await Video.destroy({
        where: {},
        truncate: false,
      });

      finalRes[resJson] = "All Video data deleted";
    } else {
      finalRes[resJson] = "Database is already empty";
    }

    return finalRes;
  }

  async reOrderByCategoryInc(order, categoryId, newOrder) {
    let finalRes = {};
    const vid = await Video.findOne({ where: { order: order } });

    let updateOldorder = await Video.increment(
      {
        order: 1,
      },
      {
        where: {
          order: { [Op.gte]: newOrder, [Op.lt]: order },
          category_id: categoryId,
        },
      }
    );

    let changeNeworder = await Video.update(
      {
        order: newOrder,
      },
      {
        where: {
          video_id: vid.video_id,
          category_id: categoryId,
        },
      }
    );

    finalRes[resJson] = "Video order changed successfully";
    return finalRes;
  }

  async reOrderByCategoryDec(order, categoryId, newOrder) {
    let finalRes = {};
    const vid = await Video.findOne({ where: { order: order } });

    let updateOldorder = await Video.increment(
      {
        order: -1,
      },
      {
        where: {
          order: { [Op.lte]: newOrder, [Op.gt]: order },
          category_id: categoryId,
        },
      }
    );

    let changeNeworder = await Video.update(
      {
        order: newOrder,
      },
      {
        where: {
          video_id: vid.video_id,
          category_id: categoryId,
        },
      }
    );

    finalRes[resJson] = "Video order changed successfully";
    return finalRes;
  }

  async getOrderCount(categoryId) {
    const ordercount = await Video.count({
      where: { category_id: categoryId },
    });
    return ordercount + 1;
  }

  async getOrderMax(categoryId) {
    const ordermax = await Video.findAll({
      attributes: [[seq.fn("max", seq.col("order")), "max"]],
      raw: true,
      where: { category_id: categoryId },
    });
    let result = ordermax.map((a) => a.max);
    return Number(result);
  }

  async getOrderMin(categoryId) {
    const ordermin = await Video.findAll({
      attributes: [[seq.fn("min", seq.col("order")), "min"]],
      raw: true,
      where: { category_id: categoryId },
    });
    const result = ordermin.map((a) => a.min);
    return Number(result);
  }

  async findcategoryId(videoid) {
    const category = await Video.findOne({
      attributes: ["category_id"],
      where: { video_id: videoid },
    });
    if (category) {
      const id = category.category_id;
      return id;
    } else {
      return 0;
    }
  }
}

export default new VideoService();

```

### category-service.js
```js
import db from "../models/index.js";
import globalValues from "../utils/global_values";
const Category = db.category;
const Video = db.video;
const resJson = globalValues.result;
const errJson = globalValues.error;
const Op = db.Sequelize.Op;
const seq = db.Sequelize;
class CategoryService {
  async addCategory(category) {
    let finalRes = {};

    let res = await Category.create(category);

    return res;
  }

  async findAllVideo() {
    let res = await Category.findAll({
      include: [
        {
          model: Video,
          as: "video",
          attributes: [
            "order",
            "title",
            "description",
            "avg_sessiontime",
            "video_duration",
            "video_url",
          ],
        },
      ],
      order: [[{ model: Video, as: "video" }, "order", "ASC"]],
    });

    return res;
  }

  async findVideoByCategory(category) {
    let res = await Category.findOne({
      where: { category: category },
      attributes: ["category"],

      include: [
        {
          model: Video,
          as: "video",
          attributes: [
            "order",
            "title",
            "description",
            "avg_sessiontime",
            "video_duration",
            "video_url",
          ],
        },
      ],
      order: [[{ model: Video, as: "video" }, "order", "ASC"]],
    });

    return res;
  }

  async addnewCategory(category) {
    const cat = await Category.findOne({
      attributes: ["category_id"],
      where: { category: category },
    });
    if (cat) {
      const id = cat.category_id;
      return id;
    } else {
      console.log(category);
      let res = await Category.create({ category: category });
      const id = res.category_id;
      return id;
    }
  }

  async updateCategoryName(category, newCategory) {
    let finalRes = {};

    let res = await Category.update(
      {
        category: newCategory,
      },
      {
        where: { category: category },
      }
    );

    finalRes[resJson] = "Category name updated successfully";

    return finalRes;
  }

  async deleteCategory(category) {
    let finalRes = {};

    const res = await Category.findOne({ where: { category: category } });

    if (!res) {
      throw Error("Category not found!");
    }
    await res.destroy({});
    finalRes[resJson] = "Category Deleted Successfully";

    return finalRes;
  }

  async findcategoryId(category) {
    const cat = await Category.findOne({
      attributes: ["category_id"],
      where: { category: category },
    });
    if (cat) {
      const id = cat.category_id;
      return id;
    } else {
      return 0;
    }
  }
}

export default new CategoryService();

```

Ok now we will design api endpoints using routes.

## route.js

```js
import express from "express";
import video from "./video-route";
import category from "./category-route";

const router = express.Router();

router.use("/api/video", video);
router.use("/api/category", category);

router.use("*", (req, res, next) => {
  res.status(404).send("PAGE NOT FOUND");
  next();
});

export default router;

```

### video-route.js

```js
import express from 'express';
import VideoController from '../controllers/video_controller';

const router = express.Router();
router.get('/videolist',VideoController.findAll);
router.post('/addvideo',VideoController.create);
router.put('/changeorder/:order/:category/:neworder',VideoController.reOrderByCategory);
router.put('/updatecategory/:id',VideoController.updateCategoryName);
router.delete("/clearall", VideoController.deleteAll);
router.get("/getvideo/:id", VideoController.findOne);
router.put('/editvideo/:id',VideoController.update);
router.delete('/deletevideo/:id',VideoController.delete );

export default router;

```


### category-route.js

```js
import express from 'express';
import CategoryController from '../controllers/category_controller';

const router = express.Router();
router.get('/categorylist',CategoryController.findAll);
router.post('/addcategory',CategoryController.create);
router.get('/filter/:category',CategoryController.findByCategory);
router.put('/updatecategory/:category',CategoryController.updateCategoryName);
router.delete('/deletecategory/:category',CategoryController.delete );

export default router;
```
Now ,let's configure swagger files for documentation of api
## swagger.js
```js
import swaggerAutogen from 'swagger-autogen';

const autogen = swaggerAutogen();

const doc = {
    info: {
        version: "1.0.0",
        title: "Video API(Restful)",
        description: "Documentation automatically generated by the <b>swagger-autogen</b> module."
    },
    host: "localhost:8080",
    definitions: {
       Video:  {
         title:"Learn Python",
         description: "Python for Beginners - Learn Python in 1 Hour",
         avg_sessiontime: "01:00:05",
         video_duration: "01:00:05",
         video_url: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
       }
      ,
       Category:{
        category: "programming"
       }
    },
    components: {
      "schemas": {
        "Video": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "nullable": false
            },
            "duration": {
              "type": "time",
              "nullable": false
            }
          },
       }
      }
    },
    securityDefinitions: {
   
    }
}

const outputFile = './dist-server/swagger.json'
const endpointsFiles = ['./server/routes/index.js']

autogen(outputFile, endpointsFiles, doc);
autogen(outputFile, endpointsFiles, doc).then(async () => {
    await import('./app.js'); 
  });
```
Run this command
```js
npm run swagger-autogen
```
Ok now just run these commmands to run the project:

```js
npm run transpile
node dist-server/app.js
```



