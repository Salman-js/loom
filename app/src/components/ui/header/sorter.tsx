import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronDown, SortAsc, SortDesc } from 'lucide-react';

const SortingDropdown = () => {
  const [selectedSort, setSelectedSort] = useState('Newest');
  const [sortOrder, setSortOrder] = useState('Asc');

  const sortOptions = [
    { label: 'Newest', value: 'newest', icon: SortDesc },
    { label: 'Oldest', value: 'oldest', icon: SortAsc },
    { label: 'Name (A-Z)', value: 'az', icon: SortAsc },
    { label: 'Name (Z-A)', value: 'za', icon: SortDesc },
  ];

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    console.log('Selected Sort:', value);
  };

  return (
    <div className='flex flex-row space-x-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon'>
            <ArrowUpDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.label)}
              className='flex items-center gap-2'
            >
              <option.icon className='w-4 h-4' />
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant='outline'
        size='icon'
        onClick={() => setSortOrder(sortOrder === 'Asc' ? 'Desc' : 'Asc')}
        title={sortOrder === 'Asc' ? 'Sort Ascending' : 'Sort Descending'}
      >
        {sortOrder === 'Asc' ? <SortAsc /> : <SortDesc />}
      </Button>
    </div>
  );
};

export default SortingDropdown;
