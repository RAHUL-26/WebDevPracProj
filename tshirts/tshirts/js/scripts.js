
var products = {
    'white': {
        
        'plain': {
            'unit_price': 5.12,
            'photo': 'v-white.jpg' 
        },
        'printed': {
            'unit_price': 8.95,
            'photo': 'v-white-personalized.jpg' 
        }
    },
    
    'colored': {
        'plain': {
            'unit_price': 6.04,
            'photo': 'v-color.jpg' 
        },
        'printed': {
            'unit_price': 9.47,
            'photo': 'v-color-personalized.png' 
        }
    }
}


// Search params

var search_params = {
    "quantity": "",
    "color": "",
    "quality": "",
    "style": "",
}


// Additional pricing rules:

// 1. The prices above are for Basic quality (q150). 
// The high quality shirt (190g/m2) has a 12% increase in the unit price.

// 2. Apply the following discounts for higher quantities: 
    // 1: above 1.000 units - 20% discount
    // 2: above 500 units - 12% discount
    // 3: above 100 units - 5% discount


// Solution:

$(function(){
    search_params.quantity=document.getElementById("result-quantity").innerHTML;
    console.log(search_params.quantity);
    search_params.color=document.getElementById("result-color").innerHTML;
    var colorVal= 'colored';
    console.log(search_params.color);
    search_params.quality=document.getElementById("result-quality").innerHTML;
    console.log(search_params.quality);
    search_params.style=document.getElementById("style").val='printed';
    var styleText=document.getElementById("result-style").innerHTML;
    console.log(search_params.style);
    
    var total = "US $"+parseFloat(search_params.quantity*(products[colorVal][search_params.style].unit_price)*0.8).toFixed(2);
    $("#price").html(total);

    var qualityHigh =false;

    var tImage=document.getElementById("product-photo");
    $("#style").change(function(){
        search_params.style= $("#style").val();
        styleText=$("#style option:selected").text();
        console.log(search_params.style);
        $("#result-style").html(styleText);

        tImage=("img/"+products[colorVal][search_params.style].photo).toString();
        console.log(tImage);
        $("#photo-product").attr("src",tImage);

        $("#thank-you").hide();
        
    });
   

    $("#quantity").change(function(){
        if($("#quantity").val()<1)
        {
            $("#quantity").val(search_params.quantity);
           // $("#result-quantity").html("1");
            alert("Minimum quantity 1");
        }
        else{
        search_params.quantity= $("#quantity").val();
        $("#result-quantity").html(search_params.quantity);
        }
        $("#thank-you").hide();
        priceCalc();
    });
  
    $("#q150").click(function(){
        search_params.quality=$(this).html();
        $("#result-quality").html(search_params.quality);
        $(this).addClass("selected");
        $("#q190").removeClass("selected");
        $("#thank-you").hide();
        qualityHigh=false;
    });
    
    $("#q190").click(function(){
        search_params.quality=$(this).html();
        $("#result-quality").html(search_params.quality);
        $(this).addClass("selected");
        $("#q150").removeClass("selected");
        $("#thank-you").hide();
        qualityHigh=true;
    });

    $("#white").click(function(){
        search_params.color=$(this).html();
        $("#result-color").html(search_params.color);
        $(this).addClass("selected");
        $("#colored").removeClass("selected");
        colorVal='white';
        tImage=("img/"+products.white[search_params.style].photo).toString();
        console.log(tImage);
        $("#photo-product").attr("src",tImage);
        $("#thank-you").hide();
     });
    
    $("#colored").click(function(){
        search_params.color=$(this).html();
        $("#result-color").html(search_params.color);
        $(this).addClass("selected");
        $("#white").removeClass("selected");

        colorVal='colored';
        tImage=("img/"+products[colorVal][search_params.style].photo).toString();
        console.log(tImage);
        $("#photo-product").attr("src",tImage);
        $("#thank-you").hide();
       
    });
    

    $("#body").click(function(){
        priceCalc();
    });

    $("#complete-order").click(function(){
      $("#thank-you").show();
    });

    function priceCalc()
    {
        window.setTimeout(function(){
            total = parseFloat(search_params.quantity*(products[colorVal][search_params.style].unit_price)*0.8);
            
            if(qualityHigh)
            total*=1.12;

           // 1: above 1.000 units - 20% discount
    // 2: above 500 units - 12% discount
    // 3: above 100 units - 5% discount
             if(search_params.quantity>1&&search_params.quantity<=100)
             {
                total*=0.8;
             }
             else if(search_params.quantity>100&&search_params.quantity<=500)
             {
                total*=0.95;
             }
             else if(search_params.quantity>500)
             {
                total*=0.88;
             }

             total = parseFloat(total).toLocaleString("en-US",/*myObj*/{style: "currency",currency: "USD"}).toString();
            $("#price").html("US "+total);
        },200);     
    }


// var myObj ={style: "currency",currency: "EUR"}
});


///Learning from solutions
/*
$("#color .option-button.selected")
to get the selected color 

$("#color .option-button.selected").attr('id');
to get the id

-> function to upadate the search_params 

-> $("#style option[value=printed]").text()  //Printed
*/







