
let categories=[], plants=[], category_map={}, fetching_trees= false;

function Loading () {
    let div = document.getElementById('grid-1');
    div.style.display = 'block';
    let loading = document.getElementById('loading');
    div.innerHTML = loading.innerHTML;
}

Loading('loading', true);

function SelectCategory( id )
{
    Loading();
    let categories= document.getElementsByClassName('category-op');
    for( let cat of categories )
    {
        cat.classList.remove('category-selected');
    }

    let elements = document.getElementsByClassName(`category-${id}`);
    
    for( let elem of elements )
    {
        elem.classList.add('category-selected');
    }

    FetchTrees(id);
}

function MobileNav(dest)
{
    if( dest !== '' ) window.location.href= `#${dest}`;
    let mobile_nav_slide= document.getElementById('mobile-nav-slide');
    if(mobile_nav_slide.style.display === 'flex') 
        mobile_nav_slide.style.display= 'none'
    else mobile_nav_slide.style.display= 'flex';

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
    btn.innerText = 'X';
    btn.style.color = 'var(--color8)';
    btn.onclick =  function(e) { RemoveFromCart(e); };
    
    div.innerHTML = `
        <div>
        <span class='name' >${plant.name}</span> <br/>
        $<span class='price' >${plant.price}</span>  x <span class='quantity' >1</span>
        </div>
        `;
    div.appendChild(btn);
    div.classList.add('cart-item');
    
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
    //alert('Remove from cart clicked');
    
}

function CloseModal()
{
    let div= document.getElementById('modal');
    div.style.display= 'none';
}

function PlantTree()
{
    alert('Thank you for planting a tree with us! ');
    let name= document.querySelector('#plant #name');
    let email= document.querySelector('#plant #email');
    let number= document.querySelector('#plant #number');
    name.value= '';
    email.value= '';
    number.value= '';
}


async function PopUpModal ( id )
{       
    //alert('popup modal clicked');
    let url = `https://openapi.programming-hero.com/api/plant/${id}`;
    let response = await fetch(url);
    let data = await response.json();
    let plant= data.plants;


    
    let div= document.getElementById('modal');
    div.style.display= 'flex';

    let div1= div.querySelector('.head-2'); ;
    div1.innerText= plant.name;

    div1= div.querySelector('.modal-photo');
    div1.style.backgroundImage = `url(${plant.image})`;

    
    div1= div.querySelector('.modal-desc');
    div1.innerText = plant.description;

    div1= div.querySelector('.modal-price');
    div1.innerText= plant.price;

    div1 = div.querySelector('.modal-cat');
    div1.innerText= plant.category;
    
    
    
    
    
        
}


async function FetchTrees(id) 
{
    let url=null; 
    if(id==999) url = 'https://openapi.programming-hero.com/api/plants';
    else url = `https://openapi.programming-hero.com/api/category/${id}`;
    let res= await fetch(url);
    let data= await res.json();
    let container= document.getElementById('grid-1');
    container.style.display= 'grid';
    container.innerHTML= '';
    plants= data.plants;
    //console.log(data);
    for( let plant of plants )
    {
        let div1= document.createElement('div');

        let div2_img = document.createElement('div');
        div2_img.style.height= '10rem';
        div2_img.style.backgroundImage = `url(${plant.image})`;
        div2_img.style.backgroundSize= 'cover';
        div2_img.style.backgroundPosition= 'center';
        div2_img.style.cursor= 'pointer';
        div2_img.onclick= function() { PopUpModal(plant.id); };

        let div2_title = document.createElement('div');
        div2_title.innerText= plant.name;
        div2_title.classList.add('head-2');

        let div2_des = document.createElement('div');
        div2_des.innerText= plant.description.substring(0, 70) + '...';
        div2_des.classList.add('text-1');

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
        div2_cart.classList.add('button-2');
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
    //console.log(data);
    categories= data.categories;
    for( let category of categories )
    {
        category_map[category.category_name]= category;
        let div= document.createElement('div');
        div.classList.add( 'category-op' );
        div.classList.add( `category-${category.id}` );
        div.onclick= function() { SelectCategory(category.id); };
        div.innerText= category.category_name;
        container.appendChild(div);
    }

    container= document.querySelector('#mobile-category #children');
    //console.log(data);
    for( let category of categories )
    {
        category_map[category.category_name]= category;
        let div= document.createElement('div');
        div.classList.add( 'category-op' );
        div.classList.add( `category-${category.id}` );
        div.onclick= function() { SelectCategory(category.id); };
        div.innerText= category.category_name;
        container.appendChild(div);
    }
    
}



FetchTrees(999);
FetchCategories();
