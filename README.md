# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


### DEFINING THE FOLDER STRUCTURE 
```
├── 🟨 eslint.config.js
├── 📄 index.html
├── 🗂️ package-lock.json
├── 🗂️ package.json
├── 📁 public
│ ├── 🖼️ calendar.gif
│ ├── 🖼️ logo.png
│ ├── 🖼️ pterodactyl.gif
│ ├── 🖼️ utsavamLogoCircle.png
│ ├── 🖼️ vite.svg
│ ├── 📄 _redirects
├── 📜 README.md
├── 📁 src
│ ├── 🎨 App.css
│ ├── 🟦 App.jsx
│ ├── 📁 assets
│ │ ├── 🖼️ animatedganesha.png
│ │ ├── 🖼️ chatbot.gif
│ │ ├── 🖼️ chatbot.png
│ │ ├── 🖼️ event1.jpeg
│ │ ├── 🖼️ event2.jpeg
│ │ ├── 🖼️ event3.jpeg
│ │ ├── 🖼️ event4.jpeg
│ │ ├── 🖼️ event5.jpeg
│ │ ├── 🖼️ event6.jpeg
│ │ ├── 🖼️ image.png
│ │ ├── 🖼️ imageold.png
│ │ ├── 🖼️ logo.png
│ │ ├── 🖼️ qrcode.png
│ │ ├── 🖼️ react.svg
│ │ ├── 🖼️ shield.gif
│ │ ├── 🖼️ signinbg.webp
│ │ ├── 🖼️ utsavamLogoBeside.png
│ │ ├── 🖼️ utsavamLogoCircle.png
│ │ ├── 🖼️ UtsavamLogoMain.png
│ │ ├── 🖼️ verified.gif
│ ├── 📁 components
│ │ ├── 🟦 LogOut.jsx
│ │ ├── 📁 pages
│ │ │ ├── 📁 admin
│ │ │ │ ├── 🟦 Base.jsx
│ │ │ │ ├── 🟦 EventManagers.jsx
│ │ │ │ ├── 🟦 Events.jsx
│ │ │ │ ├── 🟦 Profile.jsx
│ │ │ │ ├── 🟦 Reports.jsx
│ │ │ ├── 📁 event_manager
│ │ │ │ ├── 🟦 EventManagerBase.jsx
│ │ │ │ ├── 🟦 EventManagerNewDonationForm.jsx
│ │ │ │ ├── 🟦 EventManagerProfile.jsx
│ │ │ │ ├── 🟦 EventManagerRevenueReport.jsx
│ │ │ │ ├── 🟦 LoadQrScreen.jsx
│ │ │ │ ├── 🟦 NewEventManager.jsx
│ │ │ │ ├── 🟦 ViewDonatedProfile.jsx
│ │ │ ├── 📁 includes
│ │ │ │ ├── 🟦 AdminSidebar.jsx
│ │ │ │ ├── 🟦 NavbarCustom.jsx
│ │ │ │ ├── 🟦 UserNavbar.jsx
│ │ │ ├── 📁 user
│ │ │ │ ├── 🟦 UserBase.jsx
│ │ │ │ ├── 🟦 UserHome.jsx
│ │ │ ├── 📁 website
│ │ │ │ ├── 🟦 AddEventForm.jsx
│ │ │ │ ├── 🟦 ChatBotDemonstration.jsx
│ │ │ │ ├── 🟦 ClientCarousel.jsx
│ │ │ │ ├── 🟦 DonarAnimatedReceipt.jsx
│ │ │ │ ├── 🟦 EventRegistrationForm.jsx
│ │ │ │ ├── 🟦 GuideLines.jsx
│ │ │ │ ├── 🟦 Home.jsx
│ │ │ │ ├── 🟦 UtsavamHomepage.jsx
│ │ │ │ ├── 🟦 WebsiteContact.jsx
│ │ │ │ ├── 🟦 WebsiteEvents.jsx
│ │ ├── 🟦 PrivateRoute.jsx
│ │ ├── 📁 ui
│ │ │ ├── 🟦 ActivityItem.jsx
│ │ │ ├── 🟦 Badge.jsx
│ │ │ ├── 🟦 BarChart.jsx
│ │ │ ├── 🟦 BrandMark.jsx
│ │ │ ├── 🟦 ConnectedMandals.jsx
│ │ │ ├── 🟦 Counter.jsx
│ │ │ ├── 🟦 EmptyState.jsx
│ │ │ ├── 🟦 Evolution.jsx
│ │ │ ├── 🟦 Experience.jsx
│ │ │ ├── 🟦 FAQ.jsx
│ │ │ ├── 🟦 Features.jsx
│ │ │ ├── 🟦 Footer.jsx
│ │ │ ├── 🟦 Hero.jsx
│ │ │ ├── 🟦 Icon.jsx
│ │ │ ├── 🟦 Impact.jsx
│ │ │ ├── 🟦 Join.jsx
│ │ │ ├── 🟦 Journey.jsx
│ │ │ ├── 🟦 MarigoldThread.jsx
│ │ │ ├── 🟦 QuickAction.jsx
│ │ │ ├── 🟦 Reveal.jsx
│ │ │ ├── 🟦 Skeleton.jsx
│ │ │ ├── 🟦 Spirit.jsx
│ │ │ ├── 🟦 StatCard.jsx
│ │ │ ├── 🟦 Testimonials.jsx
│ │ │ ├── 🟦 Trust.jsx
│ │ ├── 📁 utils
│ │ │ ├── 🟦 ChatBot.jsx
│ │ │ ├── 🟦 ChatBotWidget.jsx
│ │ │ ├── 🟦 DurationSelector.jsx
│ │ │ ├── 🟦 Encryption.jsx
│ │ │ ├── 🟦 EventCard.jsx
│ │ │ ├── 🟦 GuideUtility.jsx
│ │ │ ├── 🟦 NewEventModal.jsx
│ │ │ ├── 🟦 ShowQrCode.jsx
│ │ │ ├── 🟦 StyledQRCode.jsx
│ ├── 📁 config
│ │ ├── 🟨 apiConfig.js
│ │ ├── 🟨 appConfig.js
│ ├── 📁 context
│ │ ├── 🟦 ConfirmDialogContext.jsx
│ │ ├── 🟦 ToastContext.jsx
│ ├── 📁 data
│ ├── 📁 hooks
│ │ ├── 🟨 useAuth.js
│ ├── 🎨 index.css
│ ├── 🟦 main.jsx
│ ├── 📁 pages
│ │ ├── 📁 admin
│ │ │ ├── 🟦 Dashboard.jsx
│ │ ├── 📁 auth
│ │ │ ├── 🟦 SignIn.jsx
│ │ │ ├── 🟦 SignUp.jsx
│ │ ├── 📁 event-manager
│ │ │ ├── 🟦 EventManagerHome.jsx
│ ├── 📁 routes
│ ├── 📁 services
│ │ ├── 🟨 api.js
│ │ ├── 🟦 get.jsx
│ ├── 📁 utils
├── 🟨 vite.config.js

```