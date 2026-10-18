# Product to Subject Type Mapping Analysis

## 1. Technical Implementation
The "Subject Type" dropdown (`cmb_subject`) is dynamically populated based on the value selected in the "Product Type" dropdown (`cmb_product`).

*   **Trigger Mechanism**: The `cmb_product` dropdown has an `onchange` event listener: `document.forms['frmisi'].act.value = 'new';this.form.submit();`.
*   **Behavior**: When a user selects a product, the entire form is submitted (page reload). The PHP script detects the `cmb_product` value from the POST/GET request.
*   **Data Logic**: The application uses a hierarchical (parent-child) structure within the `ref_subject` table.
    *   Each **Product** (from `ref_product`) is linked to a **Parent Subject** (in `ref_subject`) via the `idproduct` column.
    *   The **Dropdown Options** are the *children* of that Parent Subject.

## 2. Database Schema & Query
*   **Tables**:
    *   `ref_product`: Stores the list of available products.
    *   `ref_subject`: Stores subject types. It acts as both the mapping layer (linking to products) and the content layer (listing specific subjects).
        *   `id`: Primary Key.
        *   `parent`: References the `id` of the parent subject.
        *   `idproduct`: References the `id` of the product in `ref_product`. Used to identify the "root" or "parent" subject for a specific product.

*   **SQL Query Logic**:
    The PHP code uses a nested query to fetch the options:
    ```sql
    SELECT id, concat(repeat('--',lv),name)
    FROM ref_subject
    WHERE parent = (
        SELECT id
        FROM ref_subject
        WHERE idproduct = 'SELECTED_PRODUCT_ID'
    )
    ORDER BY urutmenu
    ```

## 3. Comprehensive Mapping List
Below is the analyzed data showing which "Subject Type" options appear for each "Product Type".

### **Incoming Transfer (S06)**
*   **Children**:
    *   Information
    *   Query Status
    *   Amendment Request
    *   Refund/Cancellation Request
    *   Cover/Vostro
    *   Feedback & Payment Report
    *   OFAC
    *   Monitoring Transaction Failure
    *   Filter Checking
    *   Complaint IT Trouble
    *   Complaint Human Error
    *   Complaint Counter Staff Unawareness
    *   Complaint Filter Checking
    *   Others

### **Outgoing Transfer (S10)**
*   **Children**:
    *   Information
    *   Query Status
    *   Complaint Counter Staff Unawareness
    *   Transaction Hold
    *   Complaint IT Trouble
    *   Monitoring
    *   Other
    *   Complaint Unreceived
    *   Complaint Filter Checking
    *   Filter Checking
    *   OFAC
    *   Complaint Human Error

### **Mobile Banking Remittance-OTR**
*   **Children**:
    *   Information
    *   Query Status
    *   OFAC
    *   Complaint IT Trouble
    *   Complaint Unreceived
    *   Complaint Counter Staff Unawaraness
    *   Complaint Human Error
    *   Other

### **Draft Drawn on BNI (S07)**
*   **Children**:
    *   Information
    *   Query Status
    *   Sequence Number
    *   Specimen
    *   Other
    *   OFAC
    *   Complaint IT Trouble
    *   Complaint Human Error
    *   Complaint Counter Staff Unawareness

### **Draft Selling (S09)**
*   **Children**:
    *   Information
    *   Query Status
    *   OFAC
    *   Complaint IT Trouble
    *   Other
    *   Complaint Human Error
    *   Complaint Counter Staff Unawareness

### **Clean Collection (S15/S16)**
*   **Children**:
    *   Information
    *   Query Status
    *   Other
    *   OFAC
    *   Complaint IT Trouble
    *   Complaint Human Error
    *   Complaint Counter Staff Unawareness

### **Traveler Cheque (S12/S13/S14)**
*   **Children**:
    *   Information
    *   Query Status
    *   Other
    *   OFAC
    *   Complaint IT Trouble
    *   Complaint Human Error
    *   Complaint Counter Staff Unawareness

### **Letter of Credit-L/C (EL/IL)**
*   **Children**:
    *   Information
    *   Master L/C
    *   Processing Status
    *   Document
    *   Proceeds
    *   Complaint IT Trouble
    *   Other
    *   Complaint Filter Checking
    *   Filter Checking
    *   OFAC
    *   Complaint Human Error
    *   Complaint Counter Staff Unawareness

### **SKBDN (EL/IL)**
*   **Children**:
    *   Information
    *   Master SKBDN
    *   Processing Status
    *   Document
    *   Proceeds
    *   Complaint IT Trouble
    *   Other
    *   OFAC
    *   Filter Checking
    *   Complaint Filter Checking
    *   Complaint Human Error
    *   Complaint Staff Unawarenes

### **Stand By L/C-SBLC (ES/IS)**
*   **Children**:
    *   Information
    *   Master SBLC
    *   Processing Status
    *   Document
    *   Proceeds
    *   Complaint IT Trouble
    *   Other
    *   OFAC
    *   Filter Checking
    *   Complaint Filter Checking
    *   Complaint Human Error
    *   Complaint Counter Staff Unawareness

### **Demand Guarantee (EG/IG)**
*   **Children**:
    *   Information
    *   Master Guarantee
    *   Processing Status
    *   Document
    *   Proceeds
    *   Complaint IT Trouble
    *   Other
    *   OFAC
    *   Filter Checking
    *   Complaint Filter Checking
    *   Complaint Human Error
    *   Complaint Counter Staff Unawareness

### **Bank Guarantee Under Counter (IG)**
*   **Children**:
    *   Information
    *   Master Guarantee
    *   Processing Status
    *   Document
    *   Proceeds
    *   Complaint IT Trouble
    *   Other
    *   OFAC
    *   Filter Checking
    *   Complaint Filter Checking
    *   Complaint Human Error
    *   Complaint Counter Staff Unawareness

### **Open Account Financing-OAF (FS)**
*   **Children**:
    *   Information
    *   Status
    *   OFAC
    *   Filter Checking
    *   Complaint Filter Checking
    *   Complaint Human Error
    *   Complaint Counter Staff Unawareness
    *   Complaint IT Trouble
    *   Other

### **Bill Collection Financing-BCF (OD/FO)**
*   **Children**:
    *   Information
    *   Status
    *   OFAC
    *   Filter Checking
    *   Complaint Filter Checking
    *   Complaint Human Error
    *   Complaint Counter Staff Unawareness
    *   Complaint IT Trouble
    *   Other

### **Document Collection (OD/ID)**
*   **Children**:
    *   Information
    *   Status
    *   OFAC
    *   Filter Checking
    *   Complaint Filter Checking
    *   Complaint Human Error
    *   Complaint Counter Staff Unawareness
    *   Complaint IT Trouble
    *   Other

### **BNI Wesel PIN (CSH)**
*   **Children**:
    *   Information
    *   Query Status
    *   Amendment Request
    *   Refund/Cancellation Request
    *   Cover/Vostro
    *   Filter Checking
    *   Complaint Filter Checking
    *   Complaint IT Trouble
    *   OFAC
    *   Complaint Human Error
    *   Other
    *   Complaint Counter Staff Unawareness

### **Credited to BNI Account (CRD)**
*   **Children**:
    *   Information
    *   Query Status
    *   Amendment Request
    *   Refund/Cancellation Request
    *   Complaint IT Trouble
    *   Cover/Vostro
    *   Compliant Filter Checking
    *   Other
    *   Complaint Counter Staff Unawareness
    *   Filter Checking
    *   OFAC
    *   Complaint Human Error

### **Credited to Other Bank Account**
*   **Children**:
    *   Information
    *   Query Status
    *   Amendment Request
    *   Refund/Cancellation Request
    *   Complaint IT Trouble
    *   Cover/Vostro
    *   Complaint Human Error
    *   Other
    *   Complaint Filter Checking
    *   Filter Checking
    *   OFAC
    *   Complaint Counter Staff Unawareness

### **Other Remittance/Payment**
*   **Children**:
    *   Others

### **Other Trade Finance**
*   **Children**:
    *   Other

### **Other Product**
*   **Children**:
    *   Other

### **Trf Non S06**
*   **Children**:
    *   Trf Non S06

### **SMS Tunai**
*   **Children**:
    *   SMS Tunai

### **MPN Valas**
*   **Children**:
    *   Information
    *   Query Status/NTPN
    *   BPN Request
    *   Complaint
    *   Other
    *   BNI Outlet (OPR)

### **Balance Inquiry**
*   **Children**:
    *   Balance Inquiry (Customer Account)
    *   Vostro Account

### **Special Case**
*   **Children**:
    *   Cancellation with Debit Authorization
    *   Fraud
    *   PO > 6 months
    *   Other
    *   IT Trouble

### **Reset BNI E-Secure Coorporate**
*   **Children**:
    *   Reset Password

### **KCLN**
*   **Children**:
    *   Kartu Kredit BNI
    *   Lain-Lain
