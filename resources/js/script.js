function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

var testCities = [];

function CityStorage() {
    var storageSelf = this;

    storageSelf.getAllObjectsFromStorage = function () {
        var values = [],
            keys = Object.keys(localStorage),
            i = keys.length;
        while (i--) {
            var wrapper = Object.assign(new CityWrapper(), JSON.parse(localStorage.getItem(keys[i])));
            var city = wrapper.deserializeCity();
            values.push(city);
        }

        return values;
    }

    storageSelf.addToStorage = function (id, obj) {
        localStorage.setItem(id, JSON.stringify(new CityWrapper(obj)));
    }

    storageSelf.deleteFromStorage = function (id) {
        localStorage.removeItem(id);
    }
}

var storage = new CityStorage();

function City(id = guid(), name = 'New City', isIndustrial = true, isCriminal = false, isPolluted = false, cityAreas = [], storage = null) {
    var citySelf = this;
    var id = id;
    var name = name;
    var isIndustrial = isIndustrial;
    var isCriminal = isCriminal;
    var isPolluted = isPolluted;
    var cityAreas = cityAreas;
    var storage = storage;

    citySelf.getId = function () {
        return id;
    }

    citySelf.getName = function () {
        return name;
    }

    citySelf.setName = function (value) {
        name = value;
        addToStorage();
    }

    citySelf.getIsIndustrial = function () {
        return isIndustrial;
    }

    citySelf.setIsIndustrial = function (value) {
        isIndustrial = value;
        addToStorage();
    }

    citySelf.getIsCriminal = function () {
        return isCriminal;
    }

    citySelf.setIsCriminal = function (value) {
        isCriminal = value;
        addToStorage();
    }

    citySelf.getIsPolluted = function () {
        return isPolluted;
    }

    citySelf.setIsPolluted = function (value) {
        isPolluted = value;
        addToStorage();
    }

    citySelf.getCityAreas = function () {
        return cityAreas;
    }

    citySelf.displayAreasNames = function () {
        var cityAreasNamesText = '';
        if (cityAreas.length) {
            var cityAreasNamesArray = [];
            cityAreas.forEach(function (item, i, arr) {
                var areaName = item.getName();
                cityAreasNamesArray.push(areaName);
            })
            cityAreasNamesText = cityAreasNamesArray.join(', ');
        }
        else {
            cityAreasNamesText = 'No areas';
        }
        return cityAreasNamesText;
    };


    citySelf.addNewArea = function (newCityArea) {
        cityAreas.push(newCityArea);
        addToStorage();
    }

    citySelf.deleteArea = function (i) {
        cityAreas.splice(i, 1);
        addToStorage();
    }

    citySelf.isValid = function () {
        return (validateText(name, 20)) ? true : false;
    }

    function addToStorage() {
        if (storage && citySelf.isValid()) {
            storage.addToStorage(id, citySelf);
        }
    }
}

function CityWrapper(city) {
    var wrapperSelf = this;
    if (city) {
        wrapperSelf['Id'] = city.getId();
        wrapperSelf['Name'] = city.getName();
        wrapperSelf['IsIndustrial'] = city.getIsIndustrial();
        wrapperSelf['IsCriminal'] = city.getIsCriminal();
        wrapperSelf['IsPolluted'] = city.getIsPolluted();
        wrapperSelf['CityAreas'] = [];

        city.getCityAreas().forEach(function (item) {
            var areaWrapper = new AreaWrapper(item);
            wrapperSelf['CityAreas'].push(areaWrapper);
        });
    }

    wrapperSelf.deserializeCity = function () {
        var cityAreas = [];
        wrapperSelf['CityAreas'].forEach(function (item) {
            var wrapper = Object.assign(new AreaWrapper(), item);
            cityAreas.push(wrapper.createArea());
        });

        var city = new City(wrapperSelf['Id'], wrapperSelf['Name'], wrapperSelf['IsIndustrial'], wrapperSelf['IsCriminal'], wrapperSelf['IsPolluted'], cityAreas, storage);
        return city;
    }
}

function AreaWrapper(area) {
    var wrapperSelf = this;
    if (area) {
        wrapperSelf['Name'] = area.getName();
        wrapperSelf['Description'] = area.getDescription();
        wrapperSelf['CitizenAmount'] = area.getCitizenAmount();
    }

    wrapperSelf.createArea = function () {
        var area = new Area(wrapperSelf['Name'], wrapperSelf['Description'], wrapperSelf['CitizenAmount']);
        return area;
    }
}

function Area(name = 'New Area', description = 'New Area Description', citizens = 0) {
    var areaSelf = this;
    var id = guid();
    var name = name;
    var description = description;
    var citizens = citizens;

    areaSelf.getId = function () {
        return id;
    }

    areaSelf.getName = function () {
        return name;
    }

    areaSelf.getDescription = function () {
        return description;
    }

    areaSelf.getCitizenAmount = function () {
        return citizens;
    }

    areaSelf.editArea = function (newName, newDescription, newAmount) {
        name = newName;
        description = newDescription;
        citizens = newAmount;
    }

    areaSelf.isValid = function () {
        return (validateText(name, 20) && validateText(description, 50) && validateNumber(citizens)) ? true : false;
    }
}

var collapseCounter = 0;
var cities = [];
var localStorageCities = storage.getAllObjectsFromStorage();

if (localStorageCities.length > 0) {
    cities = localStorageCities;
} else {
    var testCities = [];

    var area0 = new Area('AreaA', 'A very good area', 2000);
    var area1 = new Area('AreaB', 'A very bad area', 1000);
    var area2 = new Area('AreaC', 'A very beautiful area', 0);
    var area3 = new Area('AreaD', 'A dangerous area', 15000);
    var area4 = new Area('AreaE', 'A very nice area', 18000);
    var area5 = new Area('AreaF', 'A very dirty area', 0);

    var city0 = new City(guid(), 'CityA', true, false, false, [area0, area1, area2], storage);
    testCities.push(city0);

    var city1 = new City(guid(), 'CityB', false, true, false, [], storage);
    testCities.push(city1);

    var city2 = new City(guid(), 'CityC', true, true, false, [area3], storage);
    testCities.push(city2);

    var city3 = new City(guid(), 'CityD', true, false, true, [area4, area5], storage);
    testCities.push(city3);

    var city4 = new City(guid(), 'CityE', false, true, false, [], storage);
    testCities.push(city4);
    cities = testCities;
}

function createElement(type, classNames, parent, content, attributes) {
    var newElem = document.createElement(type);
    newElem.className = classNames;
    parent.appendChild(newElem);
    if (content) {
        newElem.textContent = content;
    }
    if (attributes) {
        for (key in attributes) {
            newElem.setAttribute(key, attributes[key]);
        }
    }
    return newElem;
}

function defineButtonClass(button, prop) {
    if (prop) {
        button.classList.add('button_right_true');
    }
    else {
        button.classList.remove('button_right_true');
    }
}

function toggleClassButtons(button) {
    button.classList.toggle('button_right_true');
    return button.classList.contains('button_right_true');
}

function validateText(str, len) {
    if (str.length > len) {
        alert('A too long string! Only ' + len + ' symbols are allowed.');
        return false;
    }
    if (str.search(/</m) != -1) {
        alert('The text contains incorrect symbols!')
        return false;
    }
    if ((str == null) || (str.length == 0)) {
        alert('The required field is not filled!');
        return false;
    }
    return true;
}

function validateNumber(str) {
    str = +str;
    if (isNaN(str)) {
        alert('Enter the number!');
        return false;
    }
    if (str < 0) {
        alert('Enter a positive number!');
        return false;
    }
    if (str !== Math.ceil(str)) {
        alert('Enter an integer number!');
        return false;
    }
    return true;
}

function clickOutside(popupId, func) {
    var specifiedElement = document.getElementById(popupId);
    var doc = document;
    doc.onclick = function (event) {
        var isClickInside = specifiedElement.contains(event.target);
        if (!isClickInside) {
            specifiedElement.style.display = 'none';
            if (func) {
                func();
            }
        }
    }
}

function createAccordionBlock(item, i, arr) {
    var divPanel = createElement('div', 'panel panel-default', document.getElementById('accordion'), null, { 'ID': item.getId() });
    var aCollapse = createElement('a', 'toggleCity', divPanel, null, { 'href': '#collapse' + collapseCounter, 'data-toggle': 'collapse' });
    var divPanelCollapse = createElement('div', 'panel-collapse collapse', divPanel, null, { 'id': 'collapse' + collapseCounter });
    collapseCounter++;
    var divBlock = createElement('div', 'block city_block container well', aCollapse);
    var deleteButton = createElement('div', 'button_left del_btn', divBlock, 'X');
    var editButton = createElement('div', 'button_left edit_btn', divBlock, 'E');
    var cityName = createElement('div', 'city_name name', divBlock, item.getName());
    var areasName = createElement('div', 'areas_name details', divBlock, item.displayAreasNames());
    var pollutedButton = createElement('div', 'button_right pol_btn', divBlock, 'P');
    var criminalButton = createElement('div', 'button_right crim_btn', divBlock, 'C');
    var industrialButton = createElement('div', 'button_right ind_btn', divBlock, 'I');
    defineButtonClass(pollutedButton, item.getIsPolluted());
    defineButtonClass(criminalButton, item.getIsCriminal());
    defineButtonClass(industrialButton, item.getIsIndustrial());

    pollutedButton.addEventListener('click', function (event) {
        item.setIsPolluted(toggleClassButtons(this));
        event.stopPropagation();
    })

    criminalButton.addEventListener('click', function (event) {
        item.setIsCriminal(toggleClassButtons(this));
        event.stopPropagation();
    })

    industrialButton.addEventListener('click', function (event) {
        item.setIsIndustrial(toggleClassButtons(this));
        event.stopPropagation();
    })

    deleteButton.addEventListener('click', function () {
        var del_confirm = confirm('Do you want to delete this city?');
        if (del_confirm) {
            var parElem = this.parentElement.parentElement.parentElement;
            var deleteId = parElem.getAttribute('id');
            parElem.remove();
            arr.forEach(function (item, i, arr) {
                if (item.getId() == deleteId) {
                    arr.splice(i, 1);
                }
            })
            storage.deleteFromStorage(deleteId);
        }
    })

    editButton.addEventListener('click', function (event) {
        event.stopPropagation();
        editCity();
    })

    function editCity() {
        var cityEditable = new City(item.getName(), item.getIsIndustrial(), item.getIsCriminal(), item.getIsPolluted());
        var cityPopup = document.getElementById('edit_city');
        cityPopup.querySelector('.edit_title h4').innerHTML = 'Edit City';
        document.getElementById('inputCityName').value = item.getName();
        var indButton = document.getElementById('ind_button');
        var crimButton = document.getElementById('crim_button');
        var polButton = document.getElementById('pol_button');
        var submitButton = document.getElementById('submit_btn_city');
        defineButtonClass(indButton, cityEditable.getIsIndustrial());
        defineButtonClass(crimButton, cityEditable.getIsCriminal());
        defineButtonClass(polButton, cityEditable.getIsPolluted());
        cityPopup.style.display = 'block';

        indButton.addEventListener('click', toggleIndClicked);
        crimButton.addEventListener('click', toggleCrimClicked);
        polButton.addEventListener('click', togglePolClicked);
        submitButton.addEventListener('click', submitCityButton);

        function toggleIndClicked() {
            cityEditable.setIsIndustrial(toggleClassButtons(indButton));
        }

        function toggleCrimClicked() {
            cityEditable.setIsCriminal(toggleClassButtons(crimButton));
        }

        function togglePolClicked() {
            cityEditable.setIsPolluted(toggleClassButtons(polButton));
        }

        function unsubscribeButtons() {
            submitButton.removeEventListener('click', submitCityButton);
            indButton.removeEventListener('click', toggleIndClicked);
            crimButton.removeEventListener('click', toggleCrimClicked);
            polButton.removeEventListener('click', togglePolClicked);
        }

        clickOutside('edit_city', function () {
            unsubscribeButtons();
        });

        function submitCityButton() {
            var inputCity = document.getElementById('inputCityName');
            cityEditable.setName(inputCity.value);
            if (cityEditable.isValid()) {
                item.setName(cityEditable.getName());
                item.setIsIndustrial(cityEditable.getIsIndustrial());
                item.setIsCriminal(cityEditable.getIsCriminal());
                item.setIsPolluted(cityEditable.getIsPolluted());

                var editedBlock = editButton.parentElement;
                var newName = editedBlock.querySelector('.city_name');
                newName.textContent = item.getName();

                defineButtonClass(industrialButton, item.getIsIndustrial());
                defineButtonClass(criminalButton, item.getIsCriminal());
                defineButtonClass(pollutedButton, item.getIsPolluted());

                document.getElementById('edit_city').style.display = 'none';
                unsubscribeButtons();
            }
        }

        var cancelButton = document.getElementById('cancel_btn_city');
        cancelButton.onclick = function () {
            document.getElementById('edit_city').style.display = 'none';
            unsubscribeButtons();
        }
    }

    var areasBlock = createElement('div', 'areas_block', divPanelCollapse);
    var addNewArea = createElement('div', 'add_area add_link', areasBlock, 'Add New Area');

    function createAreaBlock(item, i, arr) {
        var divAreaBlock = createElement('div', 'block area_block container well', areasBlock, null, { 'id': item.getId() });
        var deleteAreaButton = createElement('div', 'button_left del_btn', divAreaBlock, 'X');
        var editAreaButton = createElement('div', 'button_left edit_btn', divAreaBlock, 'E');
        var areaName = createElement('div', 'area_name name', divAreaBlock, item.getName());
        var areaDescription = createElement('div', 'area_description details', divAreaBlock, item.getDescription());
        var areaCitizens = createElement('div', 'area_citizens details', divAreaBlock, item.getCitizenAmount() || 'Unknown');
        var city = getCityByAreaID(item.getId());

        deleteAreaButton.addEventListener('click', deleteArea);

        function getCityByAreaID(id) {
            for (var i = 0; i < cities.length; i++) {
                var city = cities[i];
                var cityAreas = city.getCityAreas();
                for (var j = 0; j < cityAreas.length; j++) {
                    var cityArea = cityAreas[j];
                    if (cityArea.getId() == id) {
                        return city;
                    }
                }
            }
        }

        function deleteArea() {
            var del_confirm = confirm('Do you want to delete this area?');
            var city = getCityByAreaID(item.getId());
            if (del_confirm) {
                var deleteId = this.parentElement.getAttribute('ID');
                this.parentElement.remove();
                arr.forEach(function (item, i, arr) {
                    if (item.getId() == deleteId) {
                        city.deleteArea(i);
                    }
                })

                var areasNameText = city.displayAreasNames();
                areasName.textContent = areasNameText;
            }
            if (!arr.length) {
                var noAreasDiv = createElement('div', 'no_areas text-center', areasBlock, 'No Areas');
            }
        }

        editAreaButton.addEventListener('click', function (event) {
            event.stopPropagation();

            var areaPopup = document.getElementById('edit_area');
            var areaEditable = new Area(item.getName(), item.getDescription(), item.getCitizenAmount());
            var city = getCityByAreaID(item.getId());
            areaPopup.querySelector('.edit_title h4').innerHTML = 'Edit Area';
            document.getElementById('inputAreaName').value = areaEditable.getName();
            document.getElementById('inputAreaDescription').value = areaEditable.getDescription();
            document.getElementById('inputAreaCitizens').value = areaEditable.getCitizenAmount();
            areaPopup.style.display = 'block';
            var submitButton = document.getElementById('submit_btn_area');
            submitButton.addEventListener('click', submitArea);

            clickOutside('edit_area', function () {
                submitButton.removeEventListener('click', submitArea);
            });

            function submitArea() {
                var inputArea = document.getElementById('inputAreaName');
                var areaName = inputArea.value;
                var inputDescription = document.getElementById('inputAreaDescription');
                var areaDescription = inputDescription.value;
                var inputCitizens = document.getElementById('inputAreaCitizens');
                var areaCitizens = +inputCitizens.value;
                areaEditable.editArea(areaName, areaDescription, areaCitizens);

                if (areaEditable.isValid()) {
                    item.editArea(areaEditable.getName(), areaEditable.getDescription(), areaEditable.getCitizenAmount());
                    var editedBlock = editAreaButton.parentElement;
                    var newName = editedBlock.querySelector('.area_name');
                    newName.textContent = item.getName();
                    var newDescription = editedBlock.querySelector('.area_description');
                    newDescription.textContent = item.getDescription();
                    var newCitizens = editedBlock.querySelector('.area_citizens');
                    newCitizens.textContent = item.getCitizenAmount() || 'Unknown';
                    document.getElementById('edit_area').style.display = 'none';
                    var parentElem = editedBlock.closest('.panel-default');
                    var areasNameText = city.displayAreasNames();
                    parentElem.querySelector('.areas_name').textContent = areasNameText;
                    submitButton.removeEventListener('click', submitArea);
                    storage.addToStorage(city.getId(), city);
                }
            }

            var cancelButton = document.getElementById('cancel_btn_area');
            cancelButton.onclick = function () {
                document.getElementById('edit_area').style.display = 'none';
                submitButton.removeEventListener('click', submitArea);
            }
        })
    }

    if (item.getCityAreas().length) {
        item.getCityAreas().forEach(createAreaBlock);
    } else {
        var noAreasDiv = createElement('div', 'no_areas text-center', areasBlock, 'No areas');
    }

    addNewArea.addEventListener('click', function (event) {
        event.stopPropagation();
        var areaPopup = document.getElementById('edit_area');
        areaPopup.querySelector('.edit_title h4').innerHTML = 'Create New Area';
        areaPopup.style.display = 'block';
        var newArea = new Area();
        document.getElementById('inputAreaName').value = newArea.getName();
        document.getElementById('inputAreaDescription').value = newArea.getDescription();
        document.getElementById('inputAreaCitizens').value = newArea.getCitizenAmount();
        var submitButton = document.getElementById('submit_btn_area');
        submitButton.addEventListener('click', submitArea);

        clickOutside('edit_area', function () {
            submitButton.removeEventListener('click', submitArea);
        });

        function submitArea() {
            var inputArea = document.getElementById('inputAreaName');
            var areaName = inputArea.value;
            var inputDescription = document.getElementById('inputAreaDescription');
            var areaDescription = inputDescription.value;
            var inputCitizens = document.getElementById('inputAreaCitizens');
            var areaCitizens = +inputCitizens.value;
            newArea.editArea(areaName, areaDescription, areaCitizens);

            if (newArea.isValid()) {
                item.addNewArea(newArea);
                createAreaBlock(newArea, item.getCityAreas().length, item.getCityAreas());
                var editedBlock = addNewArea.parentElement.lastChild;
                var newName = editedBlock.querySelector('.area_name');
                newName.textContent = newArea.getName();
                var newDescription = editedBlock.querySelector('.area_description');
                newDescription.textContent = newArea.getDescription();
                var newCitizens = editedBlock.querySelector('.area_citizens');
                newCitizens.textContent = newArea.getCitizenAmount() || 'Unknown';
                document.getElementById('edit_area').style.display = 'none';
                var parentElem = editedBlock.closest('.panel-default');
                var noAreasDiv = parentElem.querySelector('.no_areas');
                if (noAreasDiv) {
                    noAreasDiv.parentElement.removeChild(noAreasDiv);
                }
                var areasNameText = item.displayAreasNames();
                areasName.textContent = areasNameText;
                parentElem.querySelector('.areas_name').textContent = areasNameText;
                submitButton.removeEventListener('click', submitNewArea);
            }
        }

        var cancelButton = document.getElementById('cancel_btn_area');
        cancelButton.onclick = function () {
            document.getElementById('edit_area').style.display = 'none';
            submitButton.removeEventListener('click', submitNewArea);
        }
    })
}

cities.forEach(function (item, i, arr) {
    createAccordionBlock(item, i, arr);
})

document.getElementById('add_city').addEventListener('click', function (event) {
    event.stopPropagation();
    addNewCity()
});

var cityPopup = document.getElementById('edit_city');
function addNewCity() {
    cityPopup.querySelector('.edit_title h4').innerHTML = 'Create New City';
    document.getElementById('inputCityName').value = '';
    var indButton = document.getElementById('ind_button');
    var crimButton = document.getElementById('crim_button');
    var polButton = document.getElementById('pol_button');
    var submitButton = document.getElementById('submit_btn_city');
    var newCity = new City();
    indButton.classList.add('button_right_true');
    crimButton.classList.remove('button_right_true');
    polButton.classList.remove('button_right_true');
    cityPopup.style.display = 'block';

    indButton.addEventListener('click', toggleIndClicked);
    crimButton.addEventListener('click', toggleCrimClicked);
    polButton.addEventListener('click', togglePolClicked);
    submitButton.addEventListener('click', submitNewCityButton);

    function toggleIndClicked() {
        newCity.setIsIndustrial(toggleClassButtons(indButton));
    }

    function toggleCrimClicked() {
        newCity.setIsCriminal(toggleClassButtons(crimButton));
    }

    function togglePolClicked() {
        newCity.setIsPolluted(toggleClassButtons(polButton));
    }

    function unsubscribeButtons() {
        submitButton.removeEventListener('click', submitNewCityButton);
        indButton.removeEventListener('click', toggleIndClicked);
        crimButton.removeEventListener('click', toggleCrimClicked);
        polButton.removeEventListener('click', togglePolClicked);
    }

    function submitNewCityButton() {
        var inputNewCityName = document.getElementById('inputCityName');
        newCity.setName(inputNewCityName.value);
        if (newCity.isValid()) {
            cities.push(newCity);
            createAccordionBlock(newCity, cities.length - 1, cities);
            cityPopup.style.display = 'none';
            storage.addToStorage(newCity.getId(), newCity);
            unsubscribeButtons();
        }
        else { inputNewCityNameLS.focus(); }
    }

    var cancelButton = document.getElementById('cancel_btn_city');
    cancelButton.onclick = function () {
        cityPopup.style.display = 'none';
        unsubscribeButtons();
    }

    clickOutside('edit_city', function () {
        unsubscribeButtons();
    });
}