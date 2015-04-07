from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from functools import partial

class NewUI(object):

    """Docstring for NewUI. """
    _searchInput_locator = (By.ID, "searchInput")
    _searchBtn_locator = (By.ID, "searchSubmit")

    def __init__(self, driver, baseURL):
        """TODO: to be defined1.

        :driver: TODO
        :baseURL: TODO

        """
        self._driver = driver
        self._baseURL = baseURL

    def search(self, query):
        searchInput = self._driver.find_element(*self._searchInput_locator)
        searchInput.send_keys(query)
        self._driver.find_element(*self._searchBtn_locator)


    def waitForLoadComplete(self):
        WebDriverWait(self._driver, 1000, poll_frequency=0.5).until(
            EC.invisibility_of_element_located((By.LINK_TEXT, 'Loading...'))
        )

    def titleInCaseSelectionList(self, title, listname):
        def titleInList(title, listItems, _):
            return any(map(lambda x: x.find_element_by_class_name('name').text == title, listItems))

        listItems= self._driver.find_element_by_id(listname).find_elements_by_class_name('caseverListItem')
        WebDriverWait(self._driver, 1000, poll_frequency=0.5).until(
            partial(titleInList, title, listItems)
        )
