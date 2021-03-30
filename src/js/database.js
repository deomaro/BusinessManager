let database = 0;
let business = {};

async function initializeDb(){
  let sb = lf.schema.create('bizData', 1);
  sb.createTable('income')
  .addColumn('id', lf.Type.INTEGER)
  .addColumn('title', lf.Type.STRING)
  .addColumn('amount', lf.Type.NUMBER)
  .addColumn('date', lf.Type.DATE_TIME)
  .addPrimaryKey(['id'], true);

  sb.createTable('expenses')
  .addColumn('id', lf.Type.INTEGER)
  .addColumn('title', lf.Type.STRING)
  .addColumn('amount', lf.Type.NUMBER)
  .addColumn('date', lf.Type.DATE_TIME)
  .addPrimaryKey(['id'], true);

  sb.createTable('stock')
  .addColumn('id', lf.Type.INTEGER)
  .addColumn('title', lf.Type.STRING)
  .addColumn('quantity', lf.Type.NUMBER)
  .addColumn('buyingPrice', lf.Type.NUMBER)
  .addColumn('unit', lf.Type.STRING)
  .addColumn('date', lf.Type.DATE_TIME)
  .addPrimaryKey(['id'], true);

  sb.createTable('customers')
  .addColumn('id', lf.Type.INTEGER)
  .addColumn('name', lf.Type.STRING)
  .addColumn('phone', lf.Type.STRING)
  .addColumn('info', lf.Type.STRING)
  .addColumn('date', lf.Type.DATE_TIME)
  .addPrimaryKey(['id'], true);

  sb.createTable('employees')
  .addColumn('id', lf.Type.INTEGER)
  .addColumn('name', lf.Type.STRING)
  .addColumn('phone', lf.Type.STRING)
  .addColumn('info', lf.Type.STRING)
  .addColumn('date', lf.Type.DATE_TIME)
  .addPrimaryKey(['id'], true);

  sb.createTable('sales')
  .addColumn('id', lf.Type.INTEGER)
  .addColumn('customerName', lf.Type.STRING)
  .addColumn('customerInfo', lf.Type.STRING)
  .addColumn('items', lf.Type.OBJECT)
  .addColumn('subTotal', lf.Type.NUMBER)
  .addColumn('taxable', lf.Type.BOOLEAN)
  .addColumn('taxAmount', lf.Type.NUMBER)
  .addColumn('total', lf.Type.NUMBER)
  .addColumn('date', lf.Type.DATE_TIME)
  .addPrimaryKey(['id'], true);

  sb.createTable('businessInfo')
  .addColumn('id', lf.Type.INTEGER)
  .addColumn('name', lf.Type.STRING)
  .addColumn('currency', lf.Type.STRING)
  .addColumn('date', lf.Type.DATE_TIME)
  .addPrimaryKey(['id'], true);

  await sb.connect().then(async function(db){

    database = db;

    let businessInfoTable = db.getSchema().table('businessInfo');

    await db.select().from(businessInfoTable).exec().then(async function(rows){
      //alert(JSON.stringify(rows));
      if(rows.length == 0){
        let row = businessInfoTable.createRow({
          'name':'My Business',
          'currency':'Tsh ',
          'date':new Date(),
        });

        await db.insertOrReplace().into(businessInfoTable).values([row]).exec().then(function(rows){
        });
      }
      else{
        //tables were already created
        return rows;
      }
    })
    .catch(function(e){
      return e;
    });
  });
}

async function getBusinessInfo(){
  let table = database.getSchema().table('businessInfo');
  return await (database.select().from(table).exec().then(function(rows){
    business = rows[0];
    return rows;
  }));
}


async function getIncome(){
  let table = database.getSchema().table('income');
  return (await database.select().from(table).exec().then(function(rows){
    //console.log(rows);
    return rows;
  }))
}

async function getExpenses(){
  let table = database.getSchema().table('expenses');
  return (await database.select().from(table).exec().then(function(rows){
    return rows;
  }))
}

async function getStock(){
  let table = database.getSchema().table('stock');
  return (await database.select().from(table).exec().then(function(rows){
    return rows;
  }))
}
