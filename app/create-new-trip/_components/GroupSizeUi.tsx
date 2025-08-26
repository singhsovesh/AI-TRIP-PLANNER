

export const SelectTravelesList = [
    {
      id: 1,
      title: 'Just Me',
      desc: 'A sole traveler in exploration',
      icon: '🧍‍♂️',
      people: '1',
    },
    {
      id: 2,
      title: 'A Couple',
      desc: 'Two travelers in tandem',
      icon: '👫',
      people: '2 People',
    },
    {
      id: 3,
      title: 'Family',
      desc: 'A group of fun loving adventurers',
      icon: '🏡',
      people: '3 to 5 People',
    },
    {
      id: 4,
      title: 'Friends',
      desc: 'A bunch of thrill-seekers',
      icon: '⛵',
      people: '5 to 10 People',
    },
  ];
  

  function GroupSizeUi({ onSelectedOption }: any) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center mt-1">
        {SelectTravelesList.map((item, index) => (
          <div
            key={index}
            className="p-4 border rounded-2xl bg-white hover:border-blue-500 cursor-pointer shadow-sm"
            onClick={() => onSelectedOption(item.title + ":" + item.people)}
          >
            <h2>{item.icon}</h2>
            <h3>{item.title}</h3>
           
          </div>
        ))}
      </div>
    );
  };
  
  export default GroupSizeUi;
