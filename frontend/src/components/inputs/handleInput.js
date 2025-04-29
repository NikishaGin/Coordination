export const handlesInputNumber = {
    handleKeyPress(event) {
        let keyCode = event.charCode || event.keyCode;
        if ((keyCode == 44) || (keyCode == 46)) {
            if (event.target.value.length == 0)
                event.target.value = "0,00";
            let Pos = event.target.value.indexOf(",") + 1;
            event.target.setSelectionRange(Pos, Pos);
            event.preventDefault()
        }
        if (!((48 <= keyCode) && (keyCode <= 57) && (event.target.value.length <= 17)))
            event.preventDefault()
    },

    handleKeyDown(event) {
        let keyCode = event.charCode || event.keyCode;
        if ((keyCode == 8) || (keyCode == 46)) {
            let currPos = event.target.selectionStart;
            let flag = [...[...event.target.value.matchAll(/,/g)], ...[...event.target.value.matchAll(/\s/g)]].map(
                match => currPos - match.index
            );
            if ((keyCode == 8) && flag.includes(1))
                event.target.setSelectionRange(currPos - 1, currPos - 1);
            else if ((keyCode == 46) && flag.includes(0))
                event.target.setSelectionRange(currPos + 1, currPos + 1);
        }
    },

    handleInput(event) {
        let value = event.target.value;
        let lenStr = value.length;
        let commaPos = (value.indexOf(",") > 0) ? value.indexOf(",") : lenStr;
        lenStr = commaPos + 3;
        value = value.slice(0, Math.min(lenStr, value.length));
        let currPos = Math.min(event.target.selectionStart, lenStr);
        value = value.replace(/,/g, ".").replace(/\s/g, "");
        let number = parseFloat(value);
        value = (!isNaN(number)) ? number.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";
        let newPos = (!isNaN(number)) ? Math.max(value.length - (lenStr - currPos), 0) : 0;
        event.target.value = value;
        event.target.setSelectionRange(newPos, newPos);
    },

    handlePaste(event) {
        event.preventDefault();
        let value = event.clipboardData.getData('text');
        value = value.replace(/,/g, ".").replace(/\s*|\t|\r|\n/gm, "");
        let lenStr = value.length;
        let commaPos = (value.indexOf(".") > 0) ? value.indexOf(".") : lenStr;
        lenStr = commaPos + 3;
        value = value.slice(0, Math.min(lenStr, value.length));
        value = parseFloat(value);
        event.target.value = (!isNaN(value)) ? value.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";
    }
}



export const handlesInputInn = {
    handleKeyPress(event) {
        if (!/^\d$/.test(event.key) && (event.key !== "Backspace") || (event.target.value.length == 12)) {
            event.preventDefault();
        }
    },

    handlePaste(event) {
        event.preventDefault();
        const value = event.clipboardData.getData('text').replace(/\s*|\t|\r|\n/gm, "");
        if (/^\d*$/.test(value) && (value.length <= 12))
            event.target.value = value
    }
}

