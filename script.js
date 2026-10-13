'use strict';
 
function calculateFineBill() {
    const lateInput = document.getElementById("lateDays");
    const booksInput = document.getElementById("bookCount");
    const memberType = document.getElementById("memberType").value;
    const result = document.getElementById("result");
    const breakdown = document.getElementById("breakdown");
    result.classList.remove("error");
 
    const lateDays = Number(lateInput.value);
    const bookCount = Number(booksInput.value);
 
    // Input validation (late days 0-10, books 1-5, whole numbers only)
    const valid = lateInput.value.trim() !== "" && booksInput.value.trim() !== ""
        && Number.isInteger(lateDays) && lateDays >= 0 && lateDays <= 10
        && Number.isInteger(bookCount) && bookCount >= 1 && bookCount <= 5
        && (memberType === "Student" || memberType === "Staff" || memberType === "Visitor");
 
    if (!valid) {
        result.textContent = "Invalid input. Enter late days from 0 to 10 and a whole number of books from 1 to 5.";
        result.classList.add("error");
        breakdown.textContent = "No calculation was made. Please correct the input values and try again.";
        return;
    }
 
    const rate = chooseRate(memberType);
    const basicFine = calculateFine(lateDays, bookCount, rate);
    const processingCharge = 10;
    const total = calculateTotal(basicFine, processingCharge);
 
    result.textContent = "Total fine: " + formatRupees(total);
    breakdown.textContent = buildBreakdown(memberType, lateDays, bookCount, rate, basicFine, processingCharge, total);
}
 
function formatRupees(amount) {
    return "₹" + amount.toFixed(2);
}
 
// Fine = late days x number of books x rate
function calculateFine(days, books, rate) {
    return days * books * rate;
}
 
// Student = 5, Staff = 3, Visitor = 10
function chooseRate(type) {
    if (type === "Student") {
        return 5;
    } else if (type === "Staff") {
        return 3;
    } else {
        return 10;
    }
}
 
// No fine -> no processing charge; otherwise add the charge
function calculateTotal(fine, processingCharge) {
    if (fine === 0) {
        return 0;
    }
    return fine + processingCharge;
}
 
// Day-wise cumulative fine using a for loop, then the final summary
function buildBreakdown(memberType, days, books, rate, basicFine, processingCharge, total) {
    let text = "Member type: " + memberType + "\n"
        + "Late days: " + days + "\n"
        + "Number of books: " + books + "\n"
        + "Rate: " + formatRupees(rate) + " per late day per book\n\n";
 
    text += "Day-wise cumulative fine:\n";
    if (days === 0) {
        text += "No late days, so no day-wise fine.\n";
    }
    for (let day = 1; day <= days; day++) {
        text += "Day " + day + ": " + day + " × " + books + " × " + formatRupees(rate)
            + " = " + formatRupees(calculateFine(day, books, rate)) + "\n";
    }
 
    const charge = basicFine > 0 ? processingCharge : 0;
    text += "\nLate fine: " + days + " × " + books + " × " + formatRupees(rate) + " = " + formatRupees(basicFine) + "\n"
        + "Processing charge: " + formatRupees(charge) + (charge === 0 ? " (not charged because the fine is zero)" : "") + "\n"
        + "TOTAL: " + formatRupees(total);
    return text;
}