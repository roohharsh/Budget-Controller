////////// Calculation Controller ///////////

var calCntrl = (function () {   // immediately invoked function
    // ...........private area.............
    /* as the calue from maincntrl is type of object so we create an object constructor here which will take the values from the maincntrl can create a object */
    var valObltcnstINC = function(id,description,value){
        this.id=id;   // here id refers to income id & it will help us to keep track of value
        this.description=description;
        this.value=value;
    }
    
    // prototype --> method of the object constructor
    
    var valObltcnstEXP = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;    // initial individual percentage
    }
    
    // methods for individual percentage calculation
    valObltcnstEXP.prototype.calcPercentage = function(){
        if(vals.totalall.inc > 0){    // denominator never gets zero
            this.percentage = Math.round((this.value/vals.totalall.inc)*100);
        }
        else{
            this.percentage = -1;   // when income is zero
        }
    };
    
    valObltcnstEXP.prototype.getPercentage = function(){
        return this.percentage;
    }

    // if we have 5 elements having id from 1 to 5 so id for upcoming 6th element is 6
    // for id of upcoming element just add one to id of last element of array
    
    var calbudget = function(type){    // budget calculation
        var sum=0;
        vals.allinp[type].forEach(function(cur){   // cur represent current element
            sum += cur.value;   // take all values
        });
        vals.totalall[type] = sum;    // insert in totINC & totEXP
    }

    var vals = {   // store all variables we need
        allinp:{    // inputs contain id, text & value
            inc:[],    // income array
            exp:[]     // expense array
        },
        totalall:{   // sum
            exp:0,   // total income
            inc:0    // total expense
        },
        // use as database
        budget:0,
        percent:-1   // -1 stands for nothing
    }

    
    return{
        // public area (from where we get data)
        getInput:function(type,txt,num){
            var newitem,ID;

// first we enter in our preferred array (inc/exp) & then we reach last element take its id & +1
            if(vals.allinp[type].length > 0){    // bcz if length=0 then id becomes -1 which voilates 
            ID = vals.allinp[type][vals.allinp[type].length-1].id+1;
            }
            else if(vals.allinp[type].length == 0){
                ID = 0;
            }

            // will take data from outside
            if(type  == 'inc'){    // that is +ve
                newitem = new valObltcnstINC(ID,txt,num);
            }
            else if(type == 'exp'){
                newitem = new valObltcnstEXP(ID,txt,num);
            }

            // Insert the data to array based on type
            vals.allinp[type].push(newitem);   // add new item contents at the end

            return newitem
        },
        
        // budget calculation
        calBud:function(type){     // type provided from main controller
            // 1) calculate the total
            calbudget(type);
            
            // 2) calculate the budget
            vals.budget = vals.totalall.inc - vals.totalall.exp;
            
            // 3) calculate the percent
            vals.percent = Math.round((vals.totalall.exp/vals.totalall.inc)*100);  // make percentage as integral
        },
        
        // for returning budget
        retBud:function(){
            return{
                budget:vals.budget,
                totalinc:vals.totalall.inc,
                totalexp:vals.totalall.exp,
                percent:vals.percent
            };
        },
        
        
        // deleting list from its id
        deleteItem:function(type, ID){   // delete by id of respective type
            var ids,index;  // ids of element[1,2,3,5,6.....]
            ids = vals.allinp[type].map(function(cur){   // use map bcz of return
                return cur.id;   // take each & every id
            });
            
            index = ids.indexOf(ID);   // search for ID
            
            if(index != -1){   // if there is an element of ID
                vals.allinp[type].splice(index,1);    // splice means deleted at index & delete only one element
            }
        },

        
        // percent count & get for individual expense
        calcPercent: function(){
            vals.allinp.exp.forEach(function(cur){
               cur.calcPercentage();
            })
        },
        
        getpercent: function(){
            var per = vals.allinp.exp.map(function(cur){  // use map bcz of returning
                return cur.getPercentage();
            });
            return per;
        },
        
        
        // to access values from private area
        test:function(){
            console.log(vals);    // to check our code ny write calcntrl.test()
        }
    }
})();




////////// UI Controller /////////////

var UICntrl = (function () {
    // private area --> where any other function can not enter
    var CLASSLIST = {  // to use classes undirectly
        type:'.add__type',
        description:'.add__description',
        value:'.add__value',
        button:'.add__btn',
        bud:'.budget__value',
        income:'.budget__income--value',
        expense:'.budget__expenses--value',
        percent:'.budget__expenses--percentage',
        incomelist:'.income__list',
        expenselist:'.expenses__list',
        container:'.container',
        exppercent:'.item__percentage',
        date:'.budget__title--month'
    }

    return {   // return data we extract
        // public area
        getinput: function () {  // return in object bcz of more than one returning one values
            return {   // return 3 values
                // type: document.querySelector('.sign').value,  // now sign value is under type
                // text: document.querySelector('.text').value,
                // number: document.querySelector('.number').value
                type: document.querySelector(CLASSLIST.type).value,  // to use CLASSLIST object
                description: document.querySelector(CLASSLIST.description).value,
                value: parseInt(document.querySelector(CLASSLIST.value).value)
            }
        },

        // to display the values we get from maincntrl
        addItem:function(newEle,type){   // newEle is the value we get
            var html,newHTML;
            // here we write an complete html text in single line as a string & here we pass id, text & number as per there type
            if(type == 'inc'){
                html = '<div class="item clearfix" id="inc-_id_"><div class="item_description">_description_</div><div class="right clearfix"><div class="item__value">_value_</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type == 'exp'){
                html = '<div class="item clearfix" id="exp-_id_"><div class="item_description">_description_</div><div class="right clearfix"><div class="item__value">_value_</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            // replace html string
            newHTML = html.replace('_id_',newEle.id);   // replace with respective id
            // now we edit newHTML by using replace
            newHTML = newHTML.replace('_description_',newEle.description);   
            newHTML = newHTML.replace('_value_',UICntrl.formattext(newEle.value,type));// add formatting text also 
            
            // now insert our HTML into the web page using insertAdjacentHTML
           
           if(type == 'inc') document.querySelector(CLASSLIST.incomelist).insertAdjacentHTML('beforeend',newHTML);
           else if(type == 'exp') document.querySelector(CLASSLIST.expenselist).insertAdjacentHTML('beforeend',newHTML);   
        },
        
        // cleaning stuffs (decsription & value)
        clearItem:function(){
            var field,fieldArray;
            field = document.querySelectorAll(CLASSLIST.description+','+CLASSLIST.value);
            // console.log(field);    // field is a node list now
            
            // var str = new String();
            // var arr = new Array();     --> way to create array
            // convert list into array
            fieldArray = Array.prototype.slice.call(field);  // take complete field & convert into array
            // console.log(fieldArray);
            
            // ForEach (this method only works on array so above we convert into array)
            fieldArray.forEach(function(cur,index,array){  // remember function
                cur.value = "";    // clearing number & text
            });
            
            // for focus on text or number
            fieldArray[0].focus();
        },
        
        
        /// to display budget & all
        displayBud:function(budval){
            budval.budget > 0 ? type='inc' : type='exp';   // to get type  
                
            // we want to display 4 texts 
            document.querySelector(CLASSLIST.bud).textContent = UICntrl.formattext(budval.budget,type);   // now we get formatting text
            document.querySelector(CLASSLIST.income).textContent = UICntrl.formattext(budval.totalinc,type);
            document.querySelector(CLASSLIST.expense).textContent = UICntrl.formattext(budval.totalexp,type);
            // document.querySelector(CLASSLIST.percent).textContent = budval.percent;
            
            // sign of percentage
            if(budval.percent>0){
                document.querySelector(CLASSLIST.percent).textContent = '+'+budval.percent+'%';
            }
            else{
                document.querySelector(CLASSLIST.percent).textContent = '--- %';
            }
        },
        
        
        // text formatting of budget
        formattext:function(num, type){  // since whenever a method is applied to a number it will become string
            var sign;
            // 1) decimal number
            num = Math.abs(num);    // gives absolute value
            num = num.toFixed(2);   // 2 decimal point
            
            var numsplit = num.split('.');
            console.log(numsplit);
            var int = numsplit[0];
            var dec = numsplit[1];
            
            // 2) comma in values 
            if(int.length>3){   // take only integer part
                int = int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length);
                // insert comma using substr
            }
            
            // 3) sign based on type
            type === 'exp' ? sign='-' : sign='+'   // using ternary operator
            
            // 4) format the number
            return sign+''+int+'.'+dec;
        },
        
        
        // deleting list from UICntrl
        deleteElement:function(element){    // here we get Item which contains complete id that is type & ID both
// in JS there is no method to delete the element but we can delete the child element
            var el = document.getElementById(element);
            el.parentNode.removeChild(el);   // go to parent of el & delete its child
        },
        
        
        // display the individual percentage
        displayPercent:function(percent){   // percent is an array
            var per;
            // we want to select all expenses percentage classes so use 
            per = document.querySelectorAll(CLASSLIST.exppercent);
            
            // here again per is a node list so use slice & call (as previous)
            perArray = Array.prototype.slice.call(per);  // now become array
            
            perArray.forEach(function(cur,index){
                cur.textContent = percent[index]+'%';
            })
        },
        
        
        // display date 
        displayDate:function(){
            var months;
            var d = new Date();
            months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'Oct', 'Nov', 'Dec'];
            var month = d.getMonth();
            var year = d.getFullYear();
            document.querySelector(CLASSLIST.date).textContent = months[month]+','+year;
        },

        passCLASSLIST:function(){    // to use in any other controller
            return CLASSLIST;
        }
    }
})();    // (); used to call it




////////// Main Controller /////////

// this will give command to rest both of them & connect both of them

var MainCntrl = (function () {
    // private area

    var CLASSLISTMAIN = UICntrl.passCLASSLIST();   // calling CLASSLIST fron UICntrl
    
    
    // here we perform deleting list operation
    var dltelement = function(event){
        var Item, splitItem, type, ID;
        Item = event.target.parentNode.parentNode.parentNode.parentNode.id;        
        // here 4 parents selected along with button to select whole list & also get id of topmost parent 
        if(Item){
            splitItem = Item.split('-');
            // console.log(splitItem);  --> give type & id seperately
            type = splitItem[0];   // inc/exp
            ID = parseInt(splitItem[1]);   // convert id to integer from string
            // console.log(ID);
            
            // 1)as we get id we call deleteItem fxn & delete element from calCntrl
            calCntrl.deleteItem(type,ID);   // passes argument
            
            // 2)delete element from UIContrl
            UICntrl.deleteElement(Item);    // call function who deletes from UI
            
            // 3)update budget, income, expenses & percentage
            updbudget(type);   // all gets update
        }
    }
    
    
    // for individual percentage
    var updPercent = function(type){
        // 1) update the percent
        calCntrl.calcPercent();
        
        // 2) retrieve the percent
        var percent = calCntrl.getpercent();
        
        updbudget(type);
        
        // 3) display on the UI
        // console.log(percent);  --> give array of percentages
        UICntrl.displayPercent(percent);
    }
    
    
    var updbudget = function(type){    // for play with budget
        // 1) calculate the budget
        calCntrl.calBud(type);
        
        // 2) returning the budget
        var budget = calCntrl.retBud();
        
        // 3) display it to UI
        UICntrl.displayBud(budget);   // pass values of budget we get
    }

    var initmain = function () {
        // console.log('yes it is working')  // check in console

        // 1) taking inputs from fields
        var input = UICntrl.getinput();
        // console.log(input);   --> as we enter the value & click button we get inputs in console
        

        // 2) send values to calcCntrl
        var sendinput = calCntrl.getInput(input.type, input.description, input.value)  // bcz in getinput function there is type, text & number variable
        // console.log(sendinput);    // prints id, text & number

        // 3) send values to UICntrl & display them
        UICntrl.addItem(sendinput,input.type)  // has type of + or -
        
        // 4) clearing inputs
        UICntrl.clearItem();
        
        // 5) calculate & display the budget
        updbudget(input.type);
        
        // 6) updating the individual expense percent
        updPercent(input.type);
    }

// initialisation function 
    var start = function () {  // call this function in public area
        // when we click the button
        document.querySelector(CLASSLISTMAIN.button).addEventListener('click', initmain);
        // as soon as we click, initmain called

        // how to get key from keyboard (press enter)
        document.querySelector(CLASSLISTMAIN.button).addEventListener('keypress', function (event) {  // keypress is our event
            // console.log(event) --> tells which button is pressed
            if (event.keyCode == 13 || event.which == 13) {   // 13 refers to enter
                initmain;   // if keycode is valid then initmain called
                console.log('enter has been clicked');
            }
            else {
                console.log('other button has been clicked');
            }
        });
        
        // here we want to delete list when we click cross button
        document.querySelector(CLASSLISTMAIN.container).addEventListener('click',dltelement)
    }

    return{
        // public area 
        init:function(){
            console.log('Started Aplication')
            start();   // here we call start function
            
            
            //  initial value of budget & all
            UICntrl.displayBud({
                budget:0,
                totalinc:0,
                totalexp:0,
                percentage:0
            });
            
            // call date function
            UICntrl.displayDate();
        },
    }
    
    
    
    
    

})(calCntrl,UICntrl);    // connect both of them
MainCntrl.init();    /// call init function 