**SilentWatch**

## **Overview**

**SilentWatch** is a **Windows-based cheating detection tool** built with **Electron + React + TypeScript**.
It identifies and blocks invisible cheating utilities (like *Cluely* or *Cheating Daddy*) used during online exams and interviews.

The app provides **real-time process monitoring, overlay detection, and input monitoring** with a clean and modern **GUI dashboard**.


# Sahil Projects - Silentwatch

## 1. Need Consideration List
For suspicious processes.

---

## 2. Risk Assessment Criteria
- Process name verification (safe vs suspicious lists)  
- Vendor verification  
- Folder path validation  
- **Process signature checks** *(future placeholder)*  

---

## 3. User Interface

### Main Tabs
**Process Monitor**
- Searchable process list  
- Columns: *PID, Name, Path, Risk Level*  
- Manual refresh option  

**Running Applications**  
- Shows all active apps  

**Overlay Scanner**  
- Detects hidden windows  

**Need Consideration**  
- Highlights processes needing user attention  

---

## 4. Modern React + TypeScript Frontend
- ⚛️ **Component-based architecture**  
- State management with real-time updates  
- Error handling & fallbacks  
- Dedicated **log panel** for system events  

---

## 5. Styling & UX
- Clean, **modern UI**  
- Color-coded **risk levels** for clarity  
- Responsive layout for all screen sizes  
- Loading indicators & empty states for better feedback  

---

## 6. Technical Architecture

### Backend (monitor.js)
- Modular process monitoring  
- Overlay detection  
- Risk assessment  
- Need Consideration logic  

### Frontend
- React components  
- TypeScript integration  
- UI components for each feature  
- State management  
- Error handling  


### **Installation**

1. Clone the repository

   ```bash
   git clone https://github.com/sahxzm/silentwatch.git
   ```

2. Install dependencies

   ```bash
   cd silentwatch
   npm install
   ```

3. Start the application

   ```bash
   npm run dev
   ```

---

## **Usage**

SilentWatch provides a **dashboard view** of all detected suspicious activities:

* Displays running processes
* Flags hidden/overlay apps
* Logs activities in real-time

---

## **Contributing**

Contributions are welcome! 🎉

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## **Contact**

**Sahil Singh**

* 📧 [sahilsingh0322@gmail.com](mailto:sahilsingh0322@gmail.com)
* 🔗 [LinkedIn](https://www.linkedin.com/in/sahil-singh-ba8b711b5/)
* 🐙 [GitHub](https://github.com/sahxzm)

**Project Link:** [SilentWatch Repository](https://github.com/sahxzm/silentwatch)
