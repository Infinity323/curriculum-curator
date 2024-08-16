#!/usr/bin/env python
# coding: utf-8

# In[72]:


from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.utils import ChromeType
#import time
#import os
#import wget
from time import sleep
#import pickle


# In[73]:

#Connect our webdriver to notebook
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
#driver = webdriver.Chrome('/Users/Paul/chromedriver')

#driver = webdriver.Chrome(ChromeDriverManager(chrome_type=ChromeType.CHROMIUM).install())
driver = webdriver.Chrome()
driver.get("https://www.edx.org/search?q=Cats&tab=course")


# In[74]:


elementName = len(driver.find_elements_by_class_name("btn-icon.btn-icon-inverse-primary.btn-icon-md.pgn__modal-close-button"))
if(elementName>0):
    info = driver.find_element_by_class_name('btn-icon.btn-icon-inverse-primary.btn-icon-md.pgn__modal-close-button')
    print(info)
    info.click()


# In[75]:


searchbox = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.XPATH, "//input[@id = 'main-search-search-input']")))
searchbox.clear()
keyword = "Python"
searchbox.send_keys(keyword)


# In[76]:


searchbox.send_keys(Keys.ENTER)
sleep(1)
searchbox.send_keys(Keys.ENTER)


# In[77]:


links_new = []
fin_links = []
screen = driver.find_element_by_class_name('pgn__card-grid.pgn__data-table-card-view.mb-4')
llinks = screen.find_elements_by_class_name('row')
find_href = [div.find_elements_by_class_name('col-xl-3.col-lg-4.col-sm-6.col-12') for div in llinks]
for tanks in find_href:
    for link in tanks:
        joyce = link.find_element_by_class_name('discovery-card-link.bg-white.text-black')
        links_new.append(joyce.get_attribute('href'))
print(links_new[0])
print(len(links_new))
fin_links = list(set().union(fin_links,links_new))
print("links length", len(fin_links))
print(fin_links)


# In[82]:


for slink in fin_links:
    print(slink)
    post_likes = driver.find_element_by_class_name("pl-3.ml-1.mb-0")
    print(post_likes)
    break


# In[8]:





# In[ ]:





# In[ ]:





# In[ ]:





# In[ ]:





# In[ ]:





# In[8]:


# links = []
# links_new = []
# num_post = 10

# while (len(links) < num_post):
#     screen = driver.find_element_by_class_name('pgn__card-grid pgn__data-table-card-view mb-4')
#     find_href = [div.find_elements_by_tag_name('a') for div in screen]
#     for elems in find_href:
#         for link in elems:
#             links_new.append(link.get_attribute('href'))
#             #print(link.get_attribute('href'))
#     scroll_body.send_keys(Keys.END)
#     sleep(15)
#     links = list(set().union(links,links_new))
#     print("links length", len(links))


# In[ ]:




