
let categories=[], plants=[], category_map={};

function SelectCategory( id )
{
    let categories= document.getElementsByClassName('category-op');
    for( let cat of categories )
    {
        cat.classList.remove('category-selected');
    }
    let elem = document.getElementById(`category-${id}`);
    elem.classList.add('category-selected');
    FetchTrees(id);
}

function AddToCart( plant )
{
    alert(`Added ${plant.name} to cart.`);
    let cart_items = document.getElementById('cart-items');
    let cart_total = document.getElementById('cart-total');
    let total = parseFloat(cart_total.innerText);
    total += plant.price;
    cart_total.innerText = total.toFixed(2);

    let found = false;
    for( let item of cart_items.children )
    {
        let name = item.querySelector('.name').innerText;
        if( name.includes( plant.name ) )
        {
            found = true;
            let quantity = item.querySelector('.quantity');
            quantity.innerText = parseInt(quantity.innerText)+1;
            break;
        }
    }

    if( found ) return;

    let div = document.createElement('div');
    let btn = document.createElement('button');
    btn.innerText = 'Remove';
    btn.onclick =  function(e) { RemoveFromCart(e); };
    
    div.innerHTML = `
        <div>
        <span class='name' >${plant.name}</span> <br/>
        $<span class='price' >${plant.price}</span>  X <span class='quantity' >1</span>
        </div>
        `;
    div.appendChild(btn);
    
    cart_items.appendChild(div);
    
    
}


function RemoveFromCart( e )
{
    let btn = e.target;
    let item = btn.parentElement;
    let price = parseFloat( item.querySelector('.price').innerText ) * parseFloat(  item.querySelector('.quantity').innerText );
    let cart_total = document.getElementById('cart-total');
    cart_total.innerText = ( parseFloat(cart_total.innerText) - price ).toFixed(2);
    item.parentElement.removeChild(item);
    console.log(item);
    alert('Remove from cart clicked');
    
}


async function PopUpModal ( id )
{       
    let url = `https://openapi.programming-hero.com/api/plant/${id}`;
    let response = await fetch(url);
    let data = await response.json();
    let plant= data.plants;
    console.log(data, plant);
    let div= document.getElementById('modal');
    div.innerHTML= '';
    div.style.display= 'block';
    let div1= document.createElement('div');
    div1.style.display= 'flex';
    div1.style.backgroundColor= 'var(--color1)';
    div1.id = 'modal-content';


    let div2_img = document.createElement('div');
    div2_img.style.height= '10rem';
    div2_img.style.backgroundImage = `url(${plant.image})`;
    div2_img.style.backgroundSize= 'cover';

    let div2_title = document.createElement('div');
    div2_title.innerText= plant.name;
    div2_title.classList.add('head2');

    let div2_des = document.createElement('div');
    div2_des.innerText= `Description ${plant.description}`;

    let div2_price = document.createElement('div');
    div2_price.innerText= `Price $${plant.price}`;    

    let div2_category = document.createElement('div');
    div2_category.innerText= `Category ${plant.category}`;
    
    let div2_close = document.createElement('button');
    div2_close.innerText= 'Close';
    div2_close.onclick= function() { div.style.display= 'none'; };
    
    
    div1.appendChild(div2_title);
    div1.appendChild(div2_img);
    div1.appendChild(div2_category);
    div1.appendChild(div2_price);
    div1.appendChild(div2_des);
    div1.appendChild(div2_close);
    
    div.appendChild(div1);
        
}


async function FetchTrees(id) 
{
    let url=null; 
    if(id==999) url = 'https://openapi.programming-hero.com/api/plants';
    else url = `https://openapi.programming-hero.com/api/category/${id}`;
    let res= await fetch(url);
    let data= await res.json();
    let container= document.getElementById('grid-1');
    container.innerHTML= '';
    plants= data.plants;
    console.log(data);
    for( let plant of plants )
    {
        let div1= document.createElement('div');

        let div2_img = document.createElement('div');
        div2_img.style.height= '10rem';
        div2_img.style.backgroundImage = `url(${plant.image})`;
        div2_img.style.backgroundSize= 'cover';
        div2_img.onclick= function() { PopUpModal(plant.id); };

        let div2_title = document.createElement('div');
        div2_title.innerText= plant.name;
        div2_title.classList.add('head2');

        let div2_des = document.createElement('div');
        div2_des.innerText= plant.description.substring(0, 70) + '...';

        let div2_price = document.createElement('div');
        div2_price.style.display= 'flex';
        div2_price.style.justifyContent= 'space-between';

        let div3_category = document.createElement('span');
        div3_category.innerText= `${plant.category}`;
        div3_category.style.color= 'var(--color3)';

        let div3_price = document.createElement('span');
        div3_price.innerText= `$${plant.price}`;

        div2_price.appendChild(div3_category);
        div2_price.appendChild(div3_price);
        

        let div2_cart = document.createElement('button');
        div2_cart.innerText= 'Add to Cart';
        div2_cart.classList.add('btn-cart');
        div2_cart.onclick= function() { AddToCart(plant); };
        

        div1.appendChild(div2_img);
        div1.appendChild(div2_title);
        div1.appendChild(div2_des);
        div1.appendChild(div2_price);
        div1.appendChild(div2_cart);
        div1.classList.add('card');
        

        
        
        
        container.appendChild(div1);
    }
}

async function FetchCategories()
{
    let url="https://openapi.programming-hero.com/api/categories";
    let res= await fetch(url);
    let data= await res.json();
    let container= document.getElementById('category');
    console.log(data);
    categories= data.categories;
    for( let category of categories )
    {
        category_map[category.category_name]= category;
        let div= document.createElement('div');
        div.classList.add( 'category-op' );
        div.id= `category-${category.id}`;
        div.onclick= function() { SelectCategory(category.id); };
        div.innerText= category.category_name;
        container.appendChild(div);
    }
    
}



FetchTrees(999);
FetchCategories();
