import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from functools import partial


def waitForLoadComplete(driver):
    WebDriverWait(driver, 1000, poll_frequency=0.5).until(
        EC.invisibility_of_element_located((By.LINK_TEXT, 'Loading...'))
    )


def titleInCaseSelectionList(title, listname, driver):
    def titleInList(title, listItems, driver):
        return any(map(lambda x: x.find_element_by_class_name('name').text == title, listItems))

    listItems= driver.find_element_by_id(listname).find_elements_by_class_name('caseverListItem')
    WebDriverWait(driver, 1000, poll_frequency=0.5).until(
        partial(titleInList, title, listItems)
    )


class MozTrapNewUISmokeTest(unittest.TestCase):

    def setUp(self):
        self.baseURL = "http://0.0.0.0:8888"
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(5)  # seconds

    def test_search_caseversion(self):

        driver = self.driver
        driver.get(self.baseURL)

        # Loads initially
        waitForLoadComplete(driver)

        # Search
        elem = driver.find_element_by_id("searchInput")
        elem.send_keys(' tag:test')
        driver.find_element_by_id("searchSubmit").click()


        # Search result loads
        waitForLoadComplete(driver)
        # TODO: veriyf tag in every result

    def test_shareable_uri_generation(self):

        driver = self.driver
        driver.get(self.baseURL)

        # Search
        elem = driver.find_element_by_id("searchInput")
        elem.send_keys(' tag:test')
        driver.find_element_by_id("searchSubmit").click()

        self.assertEqual(driver.current_url, self.baseURL + "/#/caseversion/search/product:%22MozTrap%22%20tag:test")  # FIXME: hardcoded product

    def test_shared_uri(self):

        driver = self.driver
        driver.get(self.baseURL + "/#/caseversion/search/product:%22MozTrap%22%20tag:foo")  # FIXME: hardcoded product
        self.assertEqual(driver.find_element_by_id("searchInput").get_attribute('value'), "product:\"MozTrap\" tag:foo")

    def test_search_suite(self):

        driver = self.driver
        driver.get(self.baseURL + "/#/suite")

        # Loads initially
        waitForLoadComplete(driver)

        # Search
        elem = driver.find_element_by_id("searchInput")
        elem.send_keys(' ONE')
        driver.find_element_by_id("searchSubmit").click()

        # Search result loads
        waitForLoadComplete(driver)
        # table = driver.find_element_by_class_name("caseverList")
        # self.assertGreater(len(table.find_elements_by_class_name('caseverListItem')), 1)
        # TODO: Verify ONE is the result

    def test_add_to_suite(self):
        driver = self.driver
        driver.get(self.baseURL + "/#/settings")
        driver.find_element_by_id("usernameInput").send_keys('admin-django')
        driver.find_element_by_id("apikeyInput").send_keys('c67c9af7-7e07-4820-b686-5f92ae94f6c9') #FIXME: how to setup this for easy test
        driver.find_element_by_id("saveBtn").click()

        driver.get(self.baseURL + "/#/suite/1")  # FIXME: test suite id?
        waitForLoadComplete(driver)

        case = driver.find_element_by_id('ni_list').find_element_by_class_name('caseverListItem')
        caseName = case.find_element_by_class_name('name').text
        case.find_element_by_tag_name('input').click()
        driver.find_element_by_id('modifySuite').click()
        titleInCaseSelectionList(caseName, 'in_list', driver)

        case = driver.find_element_by_id('in_list').find_element_by_class_name('caseverListItem')
        caseName = case.find_element_by_class_name('name').text
        case.find_element_by_tag_name('input').click()
        driver.find_element_by_id('modifySuite').click()
        titleInCaseSelectionList(caseName, 'ni_list', driver)

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
