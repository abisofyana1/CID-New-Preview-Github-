# Channel Type Dropdown Behavior Analysis

## 1. Technical Implementation
The "Channel Type" dropdown (`cmb_channel`) triggers a JavaScript function `cenelpil()` when its value changes. This function controls the visibility of an additional input field (`txt_channelnote`) located directly below the dropdown.

*   **File**: `appmod/complain_form.php`
*   **Trigger**: `onchange="cenelpil();"`
*   **Hidden Field**: `<div id="cnote">` containing `<input name="txt_channelnote">` and a dynamic label `<div id="cnote_judul">`.

## 2. Behavior Mapping
When specific "Channel Type" options are selected, the `cnote` div becomes visible, and the label changes as follows:

| Channel Type (Option) | ID | Behavior | Displayed Label | Field Purpose |
| :--- | :---: | :--- | :--- | :--- |
| **Phone** | 1 | **Shows Field** | `Phone Number` | Input phone number |
| **Web Upload** | 4 | **Shows Field** | `Phone Number` | Input contact number |
| **Email** | 5 | **Shows Field** | `Email` | Input email address |
| **Direct / Walk-in Cus** | 9 | **Shows Field** | `Phone Number` | Input contact number |
| **Other** | 10 | **Shows Field** | `Other Type` | Input other details |
| **Yahoo Messenger** | 2 | Hides Field | - | - |
| **Blackberry Messenger**| 3 | Hides Field | - | - |
| **SWIFT** | 6 | Hides Field | - | - |
| **Telex/Fax** | 7 | Hides Field | - | - |
| **WhatsApp Messenger** | 8 | Hides Field | - | - |
| **Mass Media** | 12 | Hides Field | - | - |
| **Mail/Letter** | 13 | Hides Field | - | - |

## 3. Code Reference
The logic is defined in the `cenelpil()` function:

```javascript
function cenelpil(){
    var cenel = document.getElementById('cmb_channel');
    var cnote = document.getElementById('cnote');
    var cnote_txt = document.getElementById('cnote_judul');
    
    // IDs triggering display: 1, 4, 5, 9, 10
    if(cenel.value==1 || cenel.value==4 || cenel.value==5 || cenel.value==9 || cenel.value==10) {
        cnote.style.visibility = "visible";
        
        if(cenel.value==10){
            cnote_txt.innerHTML = "Other Type ";
        }else if(cenel.value==5){
            cnote_txt.innerHTML = "Email ";
        }else if(cenel.value==9){
            cnote_txt.innerHTML = "Phone Number ";
        }else{
            // Default for 1 (Phone) and 4 (Web Upload)
            cnote_txt.innerHTML = "Phone Number ";
        }
    }else{
        cnote.style.visibility = "hidden";
    }
}
```
