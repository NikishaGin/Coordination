import React, {useState} from 'react';
import Button from "./Button.jsx";
import Input from "./Input.jsx";
import Modal from "./Modal.jsx";


const AddDebitModal = ({isOpen, onClose, onSave}) => {
    const [inn, setInn] = useState('');
    const [debtorName, setDebtorName] = useState('');
    const [petitionDate, setPetitionDate] = useState('');
    const [amount, setAmount] = useState('');
    const [rawValue, setRawValue] = useState('');
    const [touched, setTouched] = useState(false);

    const validateInn = (value) => {
        if (!/^\d*$/.test(value)) {
            return 'ИНН должен содержать только цифры';
        }
        if (value.length !== 0 && value.length !== 10 && value.length !== 12) {
            return 'ИНН должен содержать 10 или 12 цифр';
        }
        return '';
    };

    const errorMessage = validateInn(inn);
    const isValid = inn.length > 0 && !errorMessage;

    const handleInnChange = (e) => {
        const value = e.target.value;

        // Only allow digits
        if (/^\d*$/.test(value)) {
            setInn(value);
        }

        if (!touched) {
            setTouched(true);
        }
    };

    const handleDebtorNameChange = (e) => {
        setDebtorName(e.target.value);
        setTouched(prev => ({...prev, debtorName: true}));
    };

    const handlePetitionDateChange = (e) => {
        setPetitionDate(e.target.value);
        setTouched(prev => ({...prev, petitionDate: true}));
    };


    // Функция для форматирования числа
    const formatAmount = (value) => {
        // Удаляем все символы, кроме цифр
        const numericValue = value.replace(/\D/g, '');

        // Если значение пустое, возвращаем пустую строку
        if (!numericValue) return '';

        // Делим значение на рубли и копейки
        const rubles = numericValue.slice(0, -2); // Все символы, кроме последних двух
        const kopecks = numericValue.slice(-2); // Последние два символа (копейки)

        // Форматируем рубли: разделяем тысячи пробелами
        const formattedRubles = rubles.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

        // Возвращаем отформатированное значение с запятой для копеек
        return `${formattedRubles},${kopecks}`;
    };


    // Обработчик изменения значения
    const handleAmountChange = (e) => {
        const input = e.target.value;

        // Оставляем только цифры
        const numericValue = input.replace(/\D/g, '');

        // Сохраняем неформатированное значение
        setRawValue(numericValue);

        // Форматируем значение для отображения
        const formattedValue = formatAmount(numericValue);
        setAmount(formattedValue);
    };

    const handleSave = () => {
        if (isValid) {
            onSave({
                inn,
                debtorName,
                petitionDate,
                amount: rawValue,
            });
            // Очистка полей после сохранения
            setInn('');
            setDebtorName('');
            setPetitionDate('');
            setAmount('');
            setRawValue('');
            setTouched(false);
            onClose();
        }
    };


    const handleCancel = () => {
        setInn('');
        setTouched(false);
        onClose();
    };

    const modalFooter = (
        <>
            <Button variant="outline" onClick={handleCancel}>
                Отменить
            </Button>
            <Button
                variant="primary"
                disabled={!isValid}
                onClick={handleSave}
            >
                Сохранить
            </Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Добавить дебиторскую задолжность"
            footer={modalFooter}
        >
            <Input
                placeholder="ИНН (10 или 12 цифр)"
                value={inn}
                onChange={handleInnChange}
                error={touched && !!errorMessage}
                errorMessage={errorMessage}
                maxLength={12}
                autoFocus
            />
            <Input
                placeholder="Наименование дебитора"
                value={debtorName}
                onChange={handleDebtorNameChange}
            />
            <Input
                placeholder="Дата ходатайства о взыскании ДЗ"
                value={petitionDate}
                onChange={handlePetitionDateChange}
                type="date"
            />
            <Input
                placeholder="Сумма дебиторской задолженности, ₽"
                value={amount}
                onChange={handleAmountChange}
            />
        </Modal>
    );
};

export default AddDebitModal;

