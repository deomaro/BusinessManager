
let stockMenuChk = 0;



function printPeriodicStatement(){
  let mainDiv = document.getElementById('periodicStatement');
  if(mainDiv.style.display == 'block'){
    var restorepage = $('body').html();
    var printcontent = $('#periodicStatement').clone();
    $('body').empty().html(printcontent);
    window.print();
    $('body').html(restorepage);
  }
  else{
    tellUser('Generate statement please');
  }
}
async function getPeriodicStatement(){
  let mainDiv = document.getElementById('periodicStatement');
  let fromDate = $('#_fromDate').val();
  let toDate = $('#_toDate').val();
  let iRows = await getIncome();
  let eRows = await getExpenses();
  //let sRows = await getStock();

  if(fromDate.trim().length > 0 && toDate.trim().length > 0){
    //parse to date obj
    fromDate = fromDate.split('-');
    fromDate = new Date(fromDate[0], (Number(fromDate[1])-1), fromDate[2]);

    toDate = toDate.split('-');
    toDate = new Date(toDate[0], (Number(toDate[1])-1), toDate[2]);

    if(fromDate.getTime() <= toDate.getTime()){
      mainDiv.style.display = 'block';
      //lay'em data
      //create header
      let div1 = document.createElement('div');
      div1.style.width = '100%';
      div1.classList.add('text-center');
      div1.innerHTML = '<h2>PERIODIC STATEMENT</h2><h5 class="importantText">FROM '+fromDate+' TO '+toDate+'</h5><hr>';

      let div2 = document.createElement('div');
      div2.style.width = '100%';
      div2.marginTop = '30px';
      div2.classList.add('text-left');
      div2.innerHTML = '<h4>Income</h4><hr>';
      let periodicIncome = 0;
      let table2 = document.createElement('table');
      table2.style.width = '100%';
      table2.border = '1px solid black';
      let tr2 = document.createElement('tr');
      let thTitle = document.createElement('th');
      thTitle.innerHTML = 'Title';
      thTitle.style.width = '60%';
      let thAmount = document.createElement('th');
      thAmount.innerHTML = 'Amount';
      let thTime = document.createElement('th');
      thTime.innerHTML = 'Time';
      tr2.append(thTitle);
      tr2.append(thAmount);
      tr2.append(thTime);
      table2.append(tr2);
      iRows.forEach(function(item, index){
        if((item.date).getTime() >= fromDate.getTime() && (item.date).getTime() <= toDate.getTime()){
          periodicIncome += Number(item.amount);
          let _tr2 = document.createElement('tr');
          let _thTitle = document.createElement('td');
          _thTitle.innerHTML = item.title;
          let _thAmount = document.createElement('td');
          _thAmount.innerHTML = currencyFormatter(item.amount);
          let _thTime = document.createElement('td');
          _thTime.innerHTML = (item.date).toDateString();
          _tr2.append(_thTitle);
          _tr2.append(_thAmount);
          _tr2.append(_thTime);
          table2.append(_tr2);
        }
      });
      div2.append(table2);
      div2.innerHTML += '<h3 class="importantText">Total = '+currencyFormatter(periodicIncome)+'</h3><hr>';


      let div3 = document.createElement('div');
      div3.style.width = '100%';
      div3.marginTop = '30px';
      div3.classList.add('text-left');
      div3.innerHTML = '<h4>Expenses</h4><hr>';
      let periodicExpenses = 0;
      let table3 = document.createElement('table');
      table3.style.width = '100%';
      table3.border = '1px solid black';
      tr2 = document.createElement('tr');
      thTitle = document.createElement('th');
      thTitle.innerHTML = 'Title';
      thTitle.style.width = '60%';
      thAmount = document.createElement('th');
      thAmount.innerHTML = 'Amount';
      thTime = document.createElement('th');
      thTime.innerHTML = 'Time';
      tr2.append(thTitle);
      tr2.append(thAmount);
      tr2.append(thTime);
      table3.append(tr2);
      eRows.forEach(function(item, index){
        if((item.date).getTime() >= fromDate.getTime() && (item.date).getTime() <= toDate.getTime()){
          periodicExpenses += Number(item.amount);
          let _tr2 = document.createElement('tr');
          let _thTitle = document.createElement('td');
          _thTitle.innerHTML = item.title;
          let _thAmount = document.createElement('td');
          _thAmount.innerHTML = currencyFormatter(item.amount);
          let _thTime = document.createElement('td');
          _thTime.innerHTML = (item.date).toDateString();
          _tr2.append(_thTitle);
          _tr2.append(_thAmount);
          _tr2.append(_thTime);
          table3.append(_tr2);
        }
      });
      div3.append(table3);
      div3.innerHTML += '<h3 class="importantText">Total = '+currencyFormatter(periodicExpenses)+'</h3><hr>';

      //append them in creation order
      mainDiv.append(div1);
      mainDiv.append(div2);
      mainDiv.append(div3);
      mainDiv.scrollIntoView();
    }
    else{
      tellUser('Select valid dates');
    }
  }
  else{
    tellUser('Select valid dates');
  }

}

async function generateIncomeVsTime(){
  let mainDiv = document.getElementById('iGraph');
  let subDiv = document.getElementById('iGraphFooter');

  mainDiv.innerHTML = '';
  let rows = await getIncome();
  rows = rows.reverse();
  //extract amounts
  let amounts = [];
  rows.forEach(function(item){
    amounts.push(Number(item.amount));
  });

  //get maximum amount
  let maxAmount = amounts[0];
  amounts.forEach(function(item, index){
    if(item >= maxAmount){
      maxAmount = item;
    }
  });

  //get px per unit amount
  let pxPerAmount = (300 / maxAmount);

  //place the divs to draw graph
  rows.forEach(function(item, index){
    let div = document.createElement('div');
    div.style.background = '#1157d1';
    div.style.height = (pxPerAmount * Number(item.amount))+'px';
    div.style.marginTop = (300 - (pxPerAmount * Number(item.amount)))+'px';
    div.addEventListener('mouseenter', function(){
      div.style.background = 'var(--primaryDarkColor)';
      subDiv.innerHTML = '<h6>'+item.title+'</h6><h5 class="importantText"><b>'+currencyFormatter(item.amount)+'</b></h5><h6>'+new Date(item.date)+'</h6>';
    });
    div.addEventListener('mouseleave', function(){
      div.style.background = '#1157d1';
    });
    mainDiv.append(div);
  });
}

async function generateExpenseVsTime(){
  let mainDiv = document.getElementById('eGraph');
  let subDiv = document.getElementById('eGraphFooter');

  mainDiv.innerHTML = '';
  let rows = await getExpenses();
  rows = rows.reverse();
  //extract amounts
  let amounts = [];
  rows.forEach(function(item){
    amounts.push(Number(item.amount));
  });

  //get maximum amount
  let maxAmount = amounts[0];
  amounts.forEach(function(item, index){
    if(item >= maxAmount){
      maxAmount = item;
    }
  });

  //get px per unit amount
  let pxPerAmount = (300 / maxAmount);

  //place the divs to draw graph
  rows.forEach(function(item, index){
    let div = document.createElement('div');
    div.style.background = '#c41704';
    div.style.height = (pxPerAmount * Number(item.amount))+'px';
    div.style.marginTop = (300 - (pxPerAmount * Number(item.amount)))+'px';
    div.addEventListener('mouseenter', function(){
      div.style.background = 'var(--primaryDarkColor)';
      subDiv.innerHTML = '<h6>'+item.title+'</h6><h5 class="importantText"><b>'+currencyFormatter(item.amount)+'</b></h5><h6>'+new Date(item.date)+'</h6>';
    });
    div.addEventListener('mouseleave', function(){
      div.style.background = '#c41704';
    });
    mainDiv.append(div);
  });
}


function deleteStock(){
  stockMenuChk++;
  if(stockMenuChk == 1){
    let title = $('#_stockTitle').val();
    let quantity = $('#_stockQuantity').val();
    let unit = $('#_stockUnit').val();
    let buyingPrice = $('#_stockBuyingPrice').val();
    let id = $('#_stockId').val();

    if(id.trim().length > 0){
      let table = database.getSchema().table('stock');
      showLoader();
      (async function(){
        await database.delete().
        from(table).
        where(table.id.eq(id)).
        exec().then(function(){
          stockMenuChk = 0;
          closeOverlay();
          hideLoader();
          tellUser('Deleted successfully');
          setTotals();
          writeStock().then(function(){
            setTotals();
            setBusinessInfo();
          });
        }).catch(function(e){
          console.log(e);
          hideLoader();
          tellUser('Database error');
          stockMenuChk = 0;
        });
      })();
    }
    else{
      stockMenuChk = 0;
      tellUser('Fatal Program error, close then restart this program');
    }
  }
}


function updateStock(){
  stockMenuChk++;
  if(stockMenuChk == 1){
    let title = $('#_stockTitle').val();
    let quantity = $('#_stockQuantity').val();
    let unit = $('#_stockUnit').val();
    let buyingPrice = $('#_stockBuyingPrice').val();
    let id = $('#_stockId').val();

    if(id.trim().length > 0){
      if(title.trim().length > 0){
        if(quantity.trim().length > 0 && !isNaN(quantity) && Number(quantity) >= 0){
          if(buyingPrice.trim().length > 0 && !isNaN(buyingPrice) && Number(buyingPrice) > 0){
            if(unit.trim().length > 0){
              let table = database.getSchema().table('stock');

              showLoader();
              (async function(){
                await database.update(table).
                set(table.title, title).
                set(table.quantity, quantity).
                set(table.buyingPrice, buyingPrice).
                set(table.unit, unit).
                where(table.id.eq(id)).
                exec().then(function(){
                  stockMenuChk = 0;
                  closeOverlay();
                  hideLoader();
                  tellUser('Updated successfully');
                  setTotals();
                  writeStock().then(function(){
                    setTotals();
                    setBusinessInfo();
                  });
                }).catch(function(e){
                  console.log(e);
                  hideLoader();
                  tellUser('Database error');
                  stockMenuChk = 0;
                });
              })();
            }
            else{
              stockMenuChk = 0;
              tellUser('Invalid unit');
            }
          }
          else{
            stockMenuChk = 0;
            tellUser('Invalid buying price');
          }
        }
        else{
          stockMenuChk = 0;
          tellUser('Invalid quantity');
        }
      }
      else{
        stockMenuChk = 0;
        tellUser('Invalid title');
      }
    }
    else{
      stockMenuChk = 0;
      tellUser('Fatal Program error, close then restart this program');
    }
  }
}


function updateBizInfo(){
  let name = $('#bizName').val();
  let currency = $('#bizCurrency').val();

  if(name.trim().length > 0){
    if(currency.trim().length > 0){
      let table = database.getSchema().table('businessInfo');

      showLoader();
      (async function(){
        await database.update(table).
        set(table.name, name).
        set(table.currency, currency).
        where(table.id.eq(1)).
        exec().then(function(){
          window.location.reload();
        }).catch(function(e){
          console.log(e);
          hideLoader();
          tellUser('Database error');
        });
      })();
    }
    else{
      tellUser('Invalid currency');
    }
  }
  else{
    tellUser('Invalid name');
  }
}



async function writeStock(){
  let rows = await getStock();
  let mainDiv = document.getElementById('stockHolder');
  mainDiv.innerHTML = '';
  rows = rows.reverse();
  rows.forEach(function(item, index){
    let div = document.createElement('div');
    div.classList.add('shadowed');
    div.classList.add('stockItem');
    div.style.width = '100%';
    div.style.padding = '10px';
    div.addEventListener('click', function(){
      setOverlay('src/htmldata/stock_menu.html');
      setTimeout(function(){
        stockMenuChk = 0;
        $('#_stockId').val(item.id);
        $('#_stockTitle').val(item.title);
        $('#_stockQuantity').val(item.quantity);
        $('#_stockUnit').val(item.unit);
        $('#_stockBuyingPrice').val(item.buyingPrice);
      }, 500);
    })
    div.innerHTML = '<img src="src/icons/more.png"><h5><b>'+item.title+'</b></h5><h6>'+item.quantity+' '+item.unit+'</h6><h6><b><span class="businessCurrency"></span> '+currencyFormatter(item.buyingPrice)+'</b></h6><h6 class="importantText"><b>Total Value: <span class="businessCurrency"></span> '+currencyFormatter(Number(item.buyingPrice) * Number(item.quantity))+'</b></h6><h6>Added on: '+new Date(item.date)+'</h6>';
    mainDiv.append(div);
  });
}
function addStock(){
  let title = $('#_title').val();
  let quantity = $('#_quantity').val();
  let unit = $('#_unit').val();
  let buyingPrice = $('#_buyingPrice').val();
  let date = new Date();

  if(title.trim().length > 0){
    if(quantity.trim().length > 0 && !isNaN(quantity) && Number(quantity) >= 0){
      if(buyingPrice.trim().length > 0 && !isNaN(buyingPrice) && Number(buyingPrice) > 0){
        if(unit.trim().length > 0){
          let table = database.getSchema().table('stock');
          let row = table.createRow({
            'title':title,
            'unit':unit,
            'quantity':quantity,
            'buyingPrice':buyingPrice,
            'date':date
          });
          showLoader();
          (async function(){
            await database.insert().into(table).values([row]).exec().then(function(){
              $('#_title').val('');
              $('#_quantity').val('');
              $('#_unit').val('');
              $('#_buyingPrice').val('');
              hideLoader();
              tellUser('Saved successfully');
              setTotals();
              writeStock().then(function(){
                setTotals();
                setBusinessInfo();
              });
            }).catch(function(e){
              console.log(e);
              hideLoader();
              tellUser('Database error');
            });
          })();
        }
        else{
          tellUser('Invalid unit');
        }
      }
      else{
        tellUser('Invalid buying price');
      }
    }
    else{
      tellUser('Invalid quantity');
    }
  }
  else{
    tellUser('Invalid title');
  }
}


function addIncome(){
  let title = $('#_title').val();
  let amount = $('#_amount').val();

  if(title.trim().length > 0){
    if(amount.trim().length > 0 && !isNaN(amount) && Number(amount) > 0){
      let table = database.getSchema().table('income');
      let row = table.createRow({
        'title':title,
        'amount':amount,
        'date':new Date(),
      });
      showLoader();
      (async function(){
        await database.insert().into(table).values([row]).exec().then(function(){
          hideLoader();
          tellUser('Saved successfully');
          closeOverlay();
          setTotals();
        }).catch(function(e){
          console.log(e);
          hideLoader();
          tellUser('Database error');
        });
      })();
    }
    else{
      tellUser('Invalid amount');
    }
  }
  else{
    tellUser('Title cannot be empty');
  }
}


function addExpense(){
  let title = $('#_title').val();
  let amount = $('#_amount').val();

  if(title.trim().length > 0){
    if(amount.trim().length > 0 && !isNaN(amount) && Number(amount) > 0){
      let table = database.getSchema().table('expenses');
      let row = table.createRow({
        'title':title,
        'amount':amount,
        'date':new Date(),
      });
      showLoader();
      (async function(){
        await database.insert().into(table).values([row]).exec().then(function(){
          hideLoader();
          tellUser('Saved successfully');
          closeOverlay();
          setTotals();
        }).catch(function(e){
          console.log(e);
          hideLoader();
          tellUser('Database error');
        });
      })();
    }
    else{
      tellUser('Invalid amount');
    }
  }
  else{
    tellUser('Title cannot be empty');
  }
}



function currencyFormatter(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function setBusinessInfo(){
  await getBusinessInfo().then(function(){
    $('.businessName').text(business.name);
    $('.businessCurrency').text(business.currency);
    $('#bizCurrency').val(business.currency);
    $('#bizName').val(business.name);
  });
}


async function setTotals(){
  generateIncomeVsTime();
  generateExpenseVsTime();
  let iRows = await getIncome();
  let eRows = await getExpenses();
  let sRows = await getStock();
  let totalIncome = 0;
  let totalExpenses = 0;
  let totalStock = 0;
  let totalStockValue = 0;
  let totalProfit = 0;
  iRows.forEach((item)=>{
    totalIncome += Number(item.amount);
  })

  eRows.forEach((item)=>{
    totalExpenses += Number(item.amount);
  })

  sRows.forEach((item)=>{
    totalStock += 1;
    totalStockValue += (Number(item.quantity) * Number(item.buyingPrice));
  })

  totalProfit = totalIncome - totalExpenses;

  $('.totalIncome').text(currencyFormatter(totalIncome));
  $('.totalExpenses').text(currencyFormatter(totalExpenses));
  $('.totalStock').text(currencyFormatter(totalStock));
  $('.totalProfit').text(currencyFormatter(totalProfit));
  $('.totalStockValue').text(currencyFormatter(totalStockValue));
}

$(window).on('load',async function(){
  if((window.location.href).indexOf('index') > 0){
    await initializeDb().then(async function(e){
      await setBusinessInfo().then(function(){
        setTotals();
        hideLoader();
        navTo('home');
      }).catch(function(){
        setAlertDialog('Cannot initialise database', function(){
          console.log('Database error');
        });
      });

    })
    .catch(function(e){
      setAlertDialog('Cannot initialise database', function(){
        console.log('Database error');
      });
    });

  }
  else{
    hideLoader();

  }

});
