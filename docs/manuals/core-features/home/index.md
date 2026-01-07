---
outline: deep
---

# Home Page

The **Home** page mainly displays key data for the site and specific devices, and refreshes in real time with device status.

![1](/images/home/1.png)

- The first section contains the site's energy overview cards, mainly showing statistics for **PV Energy**, **Diesel Energy**, **Energy Used**, and **Saving Billing**.
- The second section is the microgrid topology diagram. It shows the direction of energy flow (device charge/discharge) and the key data of each device:
  - **PV**: `P` (current power)
  - **Load**: `P` (current power)
  - **ESS**: `P` (current power), `SOC` (battery state of charge)
  - **Diesel**: `P` (current power), `Oil` (current diesel fuel percentage)
- The third section is the power statistics curves for **PV** and **ESS**.
- The fourth section is the energy bar chart for **Diesel**, **ESS**, and **PV**.
- The fifth section is current site information statistics, covering current power for **PV** and **Diesel**, and charge/discharge status for ESS.
- The sixth section is site device information statistics, showing **P (current power)** and **U (current voltage)** for **PV**, **ESS**, and **Diesel Generator**. Users can switch devices using the left/right buttons.
- The seventh section is site alarm information, showing current alarms from left to right:
  - Alarm device
  - Alarm level (sorted by urgency: **L1>L2>L3**)
  <div class="mc-img-row"><img src="/images/home/3.png" alt="alarm level1" /><img src="/images/home/4.png" alt="alarm level2" /><img src="/images/home/5.png" alt="alarm level3" /></div>
  - Alarm information
