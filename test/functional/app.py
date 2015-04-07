from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from functools import partial
# from urllib import pathname2url

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


    def sortby(self, field):
        self._driver.find_element_by_id("orderby_" + field).click();
        self.waitForLoadComplete()


class NewUIAssertions(object):
    #def __init__(self):
        #self.super.__init__()
        #self.newui = NewUI(None, None) # for the locators

    def assertTermInSearchQuery(self, term):
        self.assertMultiLineEqual(
            self.driver.current_url,
            # self.baseURL + "/#/search/product:%22MozTrap%22{0}".format(pathname2url(term))
            self.baseURL + "/#/search/product:%22MozTrap%22{0}".format(term.replace(" ", "%20"))
        )  # FIXME: hardcoded product
        self.assertMultiLineEqual(
            self.driver.find_element(*self.newui._searchInput_locator).get_attribute('value'),
            "product:\"MozTrap\"{0}".format(term)
        )

    def titleInCaseSelectionList(self, title, listname):
        def titleInList(title, listItems, _):
            return any(map(lambda x: x.find_element_by_class_name('name').text == title, listItems))

        listItems= self.driver.find_element_by_id(listname).find_elements_by_class_name('caseverListItem')
        WebDriverWait(self.driver, 1000, poll_frequency=0.5).until(
            partial(titleInList, title, listItems)
        )
