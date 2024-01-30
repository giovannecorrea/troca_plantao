
"use client"

import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import { useState } from 'react';
import MarcarPlantaoModal from '@/components/MarcarPlantaoModal';

const datas_plantao = [
  "24/01/2024",
  "30/01/2024",
  "05/02/2024",
  "11/02/2024",
  "17/02/2024",
];

function Calendario() {
  const [isOpen, setIsOpen] = useState(false);
  const [dataPlantao, setDataPlantao] = useState('Data não selecionada')

  function closeModal() {
    setIsOpen(false)
  }

  function openModal(data_plantao: string) {
    setDataPlantao(data_plantao);
    setIsOpen(true)
  }

  async function handleSave() {
    try {
      const response = await fetch('/api/plantao', {
        method: 'POST',
        body: JSON.stringify({ dataPlantao }),
        headers: { 'Content-Type': 'application/json' },
      })
      closeModal();
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle error if needed
    }
  }
  
  return (
    <>
      <div>
        <Calendar
          onClickDay={(value) => openModal(value.toLocaleDateString())}
          locale="PT-BR"
          calendarType="gregory"
          tileClassName={({ activeStartDate, date, view }) =>
            view === "month" && datas_plantao.includes(date.toLocaleDateString())
              ? "react-calendar__tile--plantao_manha"
              : null
          }
        />
      </div>
      <MarcarPlantaoModal data_plantao={dataPlantao} isOpen={isOpen} closeModal={closeModal} handleSave={handleSave} />
    </>
  )
}

export default Calendario