import React from 'react'

const cardData = [
    { color: 'bg-red-500', title: 'Card 1'},
    { color: 'bg-blue-500', title: 'Card 2'},
    { color: 'bg-green-500', title: 'Card 3'},
    { color: 'bg-yellow-500', title: 'Card 4'},
    { color: 'bg-purple-500', title: 'Card 5'},
    { color: 'bg-pink-500', title: 'Card 6'},
    { color: 'bg-teal-500', title: 'Card 7'},
    { color: 'bg-orange-500', title: 'Card 8'},
];

const Card = ({ color, title, icon }) => (
    <div className={`flex items-center justify-center ${color} text-white shadow-md rounded-lg p-4 m-2`}>
        {/* <div className="text-3xl">{icon}</div> */}
        <h2 className="text-lg font-semibold ml-2">{title}</h2>
    </div>
);

const CardSummary = () => {
    return (
        <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1">
            {cardData.map((card, index) => (
                <Card key={index} color={card.color} title={card.title} icon={card.icon} />
            ))}
        </div>)
}

export default CardSummary;