import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

def waitForLoadComplete(driver):
    WebDriverWait(driver, 1000, poll_frequency=0.5).until(
        EC.invisibility_of_element_located((By.LINK_TEXT, 'Loading...'))
    )

class MozTrapNewUISmokeTest(unittest.TestCase):

    def setUp(self):
        self.baseURL = "http://0.0.0.0:8000"
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(5) # seconds

    def test_search_caseversion(self):


        driver = self.driver
        driver.get(self.baseURL)

        # Loads initially
        waitForLoadComplete(driver)

        # Search
        elem = driver.find_element_by_id("searchInput")
        elem.send_keys(' tag:gaia')
        driver.find_element_by_id("searchSubmit").click()

        # Search result loads
        waitForLoadComplete(driver)
        #table = driver.find_element_by_class_name("caseverList")
        #self.assertGreater(len(table.find_elements_by_class_name('caseverListItem')), 1)
        # TODO: Verify gaia tag in every result

    def test_search_suite(self):

        driver = self.driver
        driver.get(self.baseURL + "/#/suite")

        # Loads initially
        waitForLoadComplete(driver)

        # Search
        elem = driver.find_element_by_id("searchInput")
        elem.send_keys(' Smoketest')
        driver.find_element_by_id("searchSubmit").click()

        # Search result loads
        waitForLoadComplete(driver)
        #table = driver.find_element_by_class_name("caseverList")
        #self.assertGreater(len(table.find_elements_by_class_name('caseverListItem')), 1)
        # TODO: Verify gaia tag in every result

    def test_set_user_credental(self):
        driver = self.driver
        driver.get(self.baseURL + "/#/settings")

        # Search
        raise NotImplementedError

    def test_add_to_suite(self):
        raise NotImplementedError

    def test_remove_from_suite(self):
        raise NotImplementedError

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
