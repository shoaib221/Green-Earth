
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

        let div2_title = document.createElement('div');
        div2_title.innerText= plant.name;
        div2_title.classList.add('head2');

        let div2_des = document.createElement('div');
        div2_des.innerText= plant.description;

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



FetchTrees();
FetchCategories();
