import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from app import NewUI, NewUIAssertions


localURL = "http://0.0.0.0:8888"
prodURL  = "http://shinglyu.github.io/moztrap-new-ui"
baseURL = localURL
#baseURL = prodURL


class MozTrapNewUISmokeTest(unittest.TestCase, NewUIAssertions): # Use mixin
# TODO: test new case and new suite button
# TODO: test load more
# TODO: test diff
# TODO: test suite title link
# TODO: test search syntax
# TODO: test a shared link can perform as usual

    def setUp(self):
        self.baseURL = baseURL #FIXME: remove
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(5)  # seconds
        self.newui = NewUI(self.driver, baseURL)

    def test_search_caseversion(self):

        driver = self.driver
        driver.get(self.baseURL)

        # Loads initially
        self.newui.waitForLoadComplete()

        # Search
        self.newui.search(' tag:test')

        # Search result loads
        self.newui.waitForLoadComplete()
        # TODO: veriyf tag in every result

    #FIXME: cleanup
    def test_shareable_uri_generation_caseversion(self):

        driver = self.driver
        driver.get(self.baseURL)

        # Search
        elem = driver.find_element_by_id("searchInput")
        elem.send_keys(' tag:test')
        driver.find_element_by_id("searchSubmit").click()

        self.assertEqual(driver.current_url, self.baseURL + "/#/search/product:%22MozTrap%22%20tag:test")  # FIXME: hardcoded product

    #FIXME: cleanup
    def test_shared_uri_caseversion(self):

        driver = self.driver
        driver.get(self.baseURL + "/#/search/product:%22MozTrap%22%20tag:foo")  # FIXME: hardcoded product
        self.assertEqual(driver.find_element_by_id("searchInput").get_attribute('value'), "product:\"MozTrap\" tag:foo")

    #FIXME: cleanup
    def test_shareable_uri_generation_suite(self):

        driver = self.driver
        driver.get(self.baseURL + "/#/suite/")

        # Search
        elem = driver.find_element_by_id("searchInput")
        elem.send_keys(' ONE')
        driver.find_element_by_id("searchSubmit").click()

        self.assertEqual(driver.current_url, self.baseURL + "/#/suite/search/product:%22MozTrap%22%20ONE")  # FIXME: hardcoded product

    def test_shared_uri_suite(self):

        driver = self.driver
        driver.get(self.baseURL + "/#/suite/search/product:%22MozTrap%22%20TWO")  # FIXME: hardcoded product
        self.assertEqual(driver.find_element_by_id("searchInput").get_attribute('value'), "product:\"MozTrap\" TWO")

    #FIXME: cleanup
    def test_search_suite(self):

        driver = self.driver
        driver.get(self.baseURL + "/#/suite")

        # Loads initially
        self.newui.waitForLoadComplete()

        # Search
        elem = driver.find_element_by_id("searchInput")
        elem.send_keys(' ONE')
        driver.find_element_by_id("searchSubmit").click()

        # Search result loads
        self.newui.waitForLoadComplete()
        # table = driver.find_element_by_class_name("caseverList")
        # self.assertGreater(len(table.find_elements_by_class_name('caseverListItem')), 1)
        # TODO: Verify ONE is the result

    #FIXME: cleanup
    @unittest.skipIf(baseURL==prodURL, "Skipped for production before we have a test account")
    def test_add_to_suite(self):
        driver = self.driver
        driver.get(self.baseURL + "/#/settings")
        # FIXME: extract the locators
        driver.find_element_by_id("usernameInput").send_keys('admin-django')
        driver.find_element_by_id("apikeyInput").send_keys('c67c9af7-7e07-4820-b686-5f92ae94f6c9') #FIXME: how to setup this for easy test
        driver.find_element_by_id("saveBtn").click()

        driver.get(self.baseURL + "/#/suite/1")  # FIXME: test suite id?
        self.newui.waitForLoadComplete()

        case = driver.find_element_by_id('ni_list').find_element_by_class_name('caseListItem')
        caseName = case.find_element_by_class_name('name').text
        case.find_element_by_tag_name('input').click()
        driver.find_element_by_id('modifySuite').click()
        self.titleInCaseSelectionList(caseName, 'in_list')

        case = driver.find_element_by_id('in_list').find_element_by_class_name('caseListItem')
        caseName = case.find_element_by_class_name('name').text
        case.find_element_by_tag_name('input').click()
        driver.find_element_by_id('modifySuite').click()
        self.titleInCaseSelectionList(caseName, 'ni_list')

    #FIXME: cleanup
    def test_sort_caseversion(self):
        driver = self.driver
        driver.get(self.baseURL + "/#/")

        for field in ['name', 'case__priority', 'productversion',
                      'modified_on']:
            self.newui.sortby(field)
            self.assertTermInSearchQuery(' orderby:' + field)

            self.newui.sortby(field)
            self.assertTermInSearchQuery(' orderby:-' + field)
        #driver.find_element_by_id("orderby_name").click();
        #self.newui.waitForLoadComplete()
        #self.assertMultiLineEqual(driver.current_url, self.baseURL + "/#/search/product:%22MozTrap%22%20orderby:name")  # FIXME: hardcoded product
        #self.assertMultiLineEqual(driver.find_element_by_id("searchInput").get_attribute('value'), "product:\"MozTrap\" orderby:name")
        ## TODO: assert list is sorted

        #driver.find_element_by_id("orderby_name").click();
        #self.newui.waitForLoadComplete()
        #self.assertMultiLineEqual(driver.current_url, self.baseURL + "/#/search/product:%22MozTrap%22%20orderby:-name")  # FIXME: hardcoded product
        #self.assertMultiLineEqual(driver.find_element_by_id("searchInput").get_attribute('value'), "product:\"MozTrap\" orderby:-name")
        ## TODO: assert list is sorted

    def test_sort_suite(self):
        driver = self.driver
        # FIXME: extract me
        driver.get(self.baseURL + "/#/suite")

        for field in ['name', 'modified_on']:
            self.newui.sortby(field)
            self.assertTermInSearchQuery(' orderby:' + field)

            self.newui.sortby(field)
            self.assertTermInSearchQuery(' orderby:-' + field)

    def test_diff(self):

        self.driver.get(self.baseURL + "/#/")
        self.newui.waitForLoadComplete()
        self.newui.checkNthCaseverListItem(0)
        self.newui.checkNthCaseverListItem(1)
        self.newui.diffBtn.click()

        windows = self.driver.window_handles
        self.driver.switch_to_window(windows[1])

        WebDriverWait(self.driver, 1000, poll_frequency=0.5).until(
            EC.text_to_be_present_in_element((By.ID, 'path-lhs'), "http")
        )
        #self.assertNotEqual(self.driver.find_element_by_id('path-lhs').text, "")
        self.assertNotEqual(self.driver.find_element_by_id('path-rhs').text, "")

    def test_diff_search(self):

        self.driver.get(self.baseURL + "/#/search/product:\"MozTrap\" log")
        self.newui.waitForLoadComplete()
        self.newui.checkNthCaseverListItem(0)
        self.newui.checkNthCaseverListItem(1)
        self.newui.diffBtn.click()

        windows = self.driver.window_handles
        self.driver.switch_to_window(windows[1])

        WebDriverWait(self.driver, 1000, poll_frequency=0.5).until(
            EC.text_to_be_present_in_element((By.ID, 'path-lhs'), "http")
        )
        #self.assertNotEqual(self.driver.find_element_by_id('path-lhs').text, "")
        self.assertNotEqual(self.driver.find_element_by_id('path-rhs').text, "")

    def test_suite_title(self):
        self.driver.get(self.baseURL + "/#/suite")
        self.newui.waitForLoadComplete()
        title = self.newui.suiteListItems[0].find_element_by_css_selector('td.name>a').text
        self.newui.suiteListItems[0].find_element_by_css_selector('td.name>a').click()
        self.assertMultiLineEqual(self.newui.searchQuery, 'suite:"' + title + '"')

    def test_tag(self):
        self.driver.get(self.baseURL + "/#/")
        self.newui.waitForLoadComplete()
        tag = self.driver.find_element_by_css_selector('span.tag')
        tag_name = tag.text
        tag.click()
        self.assertTermInSearchQuery(' tag:"' + tag_name+ '"')

    def tearDown(self):
        for window in self.driver.window_handles:
            self.driver.switch_to_window(window)
            self.driver.close()

    #FIXME: cleanup
if __name__ == "__main__":
    unittest.main()
