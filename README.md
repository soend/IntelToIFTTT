![image alt text](image_0.png)

**Estonian ENL**

Intel to Yeelight user guide

**16****th**** February 2017**

# OVERVIEW

Intel to Yeelight is solution where smartlight iot device can be controlled by Ingress location field color. Aim is to change smart bulb color based of field that is over it in ingress.

# REQUIREMENTS

1. Ingress account

2. Android or Ios device to set up account

3. Computer on handheld with [IITC](http://iitc) support and IITC installed

4. 2.4G wireless network for smart bulb

5. Smart bulb that has [IFTTT support](https://ifttt.com/search/services) in this this guideline we describe in detail how to set up with [Yeelight](https://www.yeelight.com/) smart bulb.

# DESCRIPTION

System is working with local network where Yeelight smart bulb is authenticated against Xiaomi internet services. IFTTT is connected with Xiaomi account. And IITC is connected with api to IFTTT.

When in IITC map is loaded then userscript is checking biggest field at defined location and saves that ID to system. When ID is different than  previous save then opens new tab with weblink that triggers IFTTT service. Based on that trigger bulb is turned on user defined colour or state.

# Table of Contents

[[TOC]]

# How To Guide

## Get Yeelight IOT bulb

[Yeelight](https://www.yeelight.com/) is available on online shopping. Depending on intended application you can choose any bulb that is supported by IFTTT.

This guideline is using [Yeelight LED Bulb (Color)](https://www.yeelight.com/en_US/product/wifi-led-c) that cost approximately 20€ and can be ordered for example from [ebay](http://www.ebay.co.uk/itm/Xiaomi-Yeelight-220V-9W-E27-LED-Wireless-WIFI-Control-Smart-Color-Light-Bulb-/182268890449).

## Install app

1. Download Yeelight Android test app [here](http://42.96.138.58/app/android/standalone/yeelight.apk) or update your iOS Yeelight app to the latest version.

2. Create account and find Bulb by guidelines from app.

3. Choose location "Singapore"

More support or details you can find from [Yeelight forums](http://forum.yeelight.com/t/yeelight-ifttt-service-is-now-officially-published/225).

1. Create custom scene in Yeelight app. I create scene caller green and blue

1. Choose colour and brightness what you like and choose right up corner (favorite)

![image alt text](image_1.png)

b) Name your scene as you prefer

![image alt text](image_2.png)

## Configure IFTTT

1. Create account to [IFTTT](https://ifttt.com/)

2. Search yeelight service

![image alt text](image_3.png)

3.  Connect service with yeelight account that you just created.

![image alt text](image_4.png)

4. Search service Maker

![image alt text](image_5.png)

5. Create a trigger based we request

![image alt text](image_6.png)

6. System will give you trigger URL note that up

![image alt text](image_7.png)

7. Create new Applet by choosing My Applets and then New Applet

![image alt text](image_8.png)

8. Click on + this

![image alt text](image_9.png)

9. Search service caller Maker and choose it

![image alt text](image_10.png)

10. Choose to create receive a web request

![image alt text](image_11.png)

11. Use event named "ENL" if green field is over you and event “RES” if blue field is over you and Create trigger.

![image alt text](image_12.png)

12. Choose +that

![image alt text](image_13.png)

13. Search yeelight and choose it.

![image alt text](image_14.png)

14. Choose action - this time i want to change colour

![image alt text](image_15.png)

15. Choose your Yeelight Bulb name and scene that you created in app

![image alt text](image_16.png)

16. Choose Finish to create Applet.

![image alt text](image_17.png)

17. Create similar applet for blue field. Just choose color blue and call event "RES".

## Configure IITC

1. Log into [IITC](https://www.ingress.com/intel) and zoom to your home area

2. Install intel-to-YeeLight plugin by opening link 

3. Refresh IITC page and enter previously noted Maker URL part

4. Choose from IITC rightsite menu "Set YeeLight point"

	And click on map where you want that script checks top field color

5. Install Periodic refresh plugin for IICT "[https://static.iitc.me/build/release/plugins/periodic-refresh.user.js](https://static.iitc.me/build/release/plugins/periodic-refresh.user.js)" to autorefresh page.

6. Refresh IITC and if your location has field on top then IITC should automatically open and close tab to call colour change in bulb.
