/******************************************
Treehouse FSJS Techdegree:
project 1 - List Filter and Pagination

To do list:
   Meets Expectations
      [C] Project contains only plain "vanilla" JavaScript and doesn't rely on jQuery, some other library, or any code snippets or plugins
      [C] No inline JavaScript. All JS is linked from an external file
      [C] Uses unobtrusive JavaScript to append markup for the pagination links. So none of the pagination link's markup is added into the HTML.
      [C] Pagination links are created. If there are 44 students, 5 links should be generated, if there’s 64 students, 7 links should be generated. Etc.
      [C] The first 10 students are shown when the page loads, and each pagination link displays the correct students.
      [C] Clicking on “1” in the pagination links should show students 1 to 10. Clicking “2” shows 11 to 20. Clicking “5” shows students 41 to 50, and so on.
      [C] Code comments have been added explaining how the functions work.

   Exceeds Expectations
      [C] Use unobtrusive JavaScript to append HTML for a search bar.
      [C] Pagination links display based on how many search results are returned. For example: if 10 or fewer results are returned, 0 or 1 pagination links are displayed. If 22 search results are returned, 3 pagination links are displayed.
      [C] When a search yields 0 results, a message is displayed on the page, informing the user that no results have been found.

   Bonus
      [C] Display the search term when no results are found
      [C] Add a clear search button


0. Global variables
1. Create Element
2. Hide List
3. Show Page
4. Build no results
5. Remove no results
6. Append Page Links
7. Append Search
8. Run our program on page load

******************************************/

/**
* 0. Global variables
*/
const appWrapper = document.querySelector('.page');
const pageHeader = document.querySelector('.page-header');
const listOriginal = document.querySelectorAll('.student-list > li');
const names = document.querySelectorAll('.student-list > li h3');
const itemsPerPage = 10;
const defaultPage = 1; 
let searchList = [];


/**
* 1. Create Element
* - Creates an html element
*     - elementName = the tagname of the element
*     - appendTo = a parent element to append to (optional)
*     - textContent = a string for the text name (optional)
*     - properties = object of properties such as class, href, etc (optional)
*
* - Research from: 
*     A. loops through properties and attaches a property with its value
*        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
*/
const createElement = (elementName, appendTo, textContent, properties) => {
   const element = document.createElement(elementName);

   // A
   if (properties) {
      for (let i in properties) {
         element[i] = properties[i];
      }
   }
   
   // if available add text content
   if (textContent) {
      element.textContent = textContent;
   }

   // if possible attach to a parent element
   if (appendTo) {
      appendTo.appendChild(element);
   }

   return element;
};


/**
* 2. Hide List
*     - Hides every list item by default
*/
const hideList = () => {
   for (let i = 0; i < listOriginal.length; i++) {
      listOriginal[i].style.display = 'none';
   }
};


/**
* 3. Show Page
*     - Shows the active list items and hides the rest
*     - list = object
*     - currentPage = integer
*     - name = string for the searched name (optional)
*/
const showPage = (list, currentPage, name) => {
   // first hide all lists items
   hideList();

   // remove no results if is there
   removeNoResults();

   // Define where to start and end the pagination
   const toItem = currentPage * itemsPerPage; 
   const fromItem = toItem - itemsPerPage;

   // If no results, display the no results div
   const keyword = name ? name : '';
   if( list.length === 0) {
      buildNoResults(keyword);
   } else {
      // loop removes display none from matching elements
      for (let i = 0; i < list.length; i++) {
         if (i >= fromItem && i < toItem) {
            list[i].style.display = '';
         }
      }
   }
};


/**
* 4. Build no results
*     - Markup for when no results are available
*     - name = the current search string (optional)
*/
const buildNoResults = name => {
   let customName = 'No Results';

   if (name) {
      customName += ' for ' + name;
   }

   // easter egg
   if (name === 'harry potter') {
      customName = 'Harry Potter is on board without a ticket!'
   }

   const noResults = createElement('div', appWrapper, false, {
      className: 'no-results'
   });

   const heading = createElement('h2', noResults, customName);

   // add a clear selection button
   const clear = createElement('a', noResults, 'Clear Search', {
      className: 'clear-btn',
      href: '#'
   });
   clear.addEventListener('click', (e) => {
      e.preventDefault();

      const search = document.querySelector('.student-search input');
      const button = document.querySelector('.student-search button');

      search.value = '';

      // triggers a click
      button.click();
   });
};

/**
* 5. Remove no results
*     - Removes the no results div
*/
const removeNoResults = () => {
   if (document.contains(document.querySelector('.no-results'))) {
      document.querySelector('.no-results').remove();
   }
};


/**
* 6. Append Page Links
* - Attaches pagination functionality to the page.
*     - list = object of list elements
*/
const appendPageLinks = list => {
   /**
   * Create Pagination Item
   * - Builds markup for li and a elements
   * 
   * Research : 
   *     A. I'm using a ternary operator for the className property.
   *        I've used this before in PHP.
   *        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
   */
   const createPaginationItem = (index, parent) => {
      const li = createElement('li', parent);

      // A
      const a = createElement('a', li, false, {
         textContent: index,
         href: '#',
         className: (defaultPage === index) ? 'active' : ''
      });
   };

   /**
   * Trigger Page
   * - executes a page switch
   */
   const triggerPage = event => {
      
      // prevent page reload
      event.preventDefault();

      // select future old active link
      const activePagination = document.querySelector('.active');

      // select new link element
      const link = event.target;
      const page = link.textContent;

      // remove old active link
      activePagination.classList.remove('active');

      // add active class to new link
      link.classList.add('active');

      // display the new page
      showPage(list, page);
   }

   // Removes pagination wrapper if it already exists.
   if ( document.contains( document.querySelector('.pagination') ) ) {
      document.querySelector('.pagination').remove();
   }

   // Create pagination wrapper and add it to the appWrapper
   const paginationWrapper = createElement('div', appWrapper, false, {
      className: 'pagination'
   });

   // Create group wrapper and add it to the paginationWrapper
   const paginationGroup = createElement('ul', paginationWrapper);

   // Create pagination items and add it to the paginationGroup
   const numberPages = Math.ceil(list.length / itemsPerPage);
   for(let i = 1; i <= numberPages; i++) {
      createPaginationItem(i, paginationGroup);
   }

   // paginationWrapper triggers
   paginationWrapper.addEventListener('click', (e) => {
      // link trigger
      if( e.target.tagName === 'A' ){
         triggerPage(e);
      }
   });
};


/**
* 7. Append Search
*     - Research from:
*        A. Keycode for enter https://stackoverflow.com/a/1909490
*/
const appendSearch = () => {
   // Setup our html elements
   const searchWrapper = createElement('div', pageHeader, false, {
      className: 'student-search'
   });
   const searchInput = createElement('input', searchWrapper, false, {
      placeholder: 'Search for passengers...'
   });
   const searchButton = createElement('button', searchWrapper, 'Search');

   // A
   let globalTimeout = null; 

   const triggerSearch = () => {
      // clear time
      globalTimeout = null;

      // we need a lowercase input to match our names
      let keyword = searchInput.value.toLowerCase();
      
      // clear global search list array
      // learned this trick from Emma W!
      searchList.length = 0;

      // Pushes any matching names to global array searchList
      for (let i = 0; i < names.length; i++) {
         let studentName = names[i].textContent;

         if (studentName.includes(keyword)) {
            let li = names[i].parentNode.parentNode;
            searchList.push(li);
         }
      }

      showPage(searchList, defaultPage, keyword);
      appendPageLinks(searchList);
   };

   // Trigger for when user is typing
   searchWrapper.addEventListener('keyup', e => {
      // A
      // Listen for when someone pressed enter and execute right away
      if (e.keyCode === 13) {
         triggerSearch();
      } 
      
      // Otherwise wait .3 seconds before executing code.
      // This prevents from code running too many times
      else {
         if (globalTimeout != null) {
            clearTimeout(globalTimeout);
         }
         globalTimeout = setTimeout(() => {
            triggerSearch();
         }, 750);
      }
   });

   // Trigger for search button
   searchButton.addEventListener('click', () => {
      triggerSearch();
   });
};


/**
* 8. Run our program on page load
*/
showPage(listOriginal, defaultPage);
appendPageLinks(listOriginal);
appendSearch();