import { Search, X, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onRefresh: () => void;
}

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onRefresh
}: SearchBarProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search messages..."
          className="pl-8 w-full md:w-64"
          value={searchQuery}
          onChange={onSearchChange}
        />
        {searchQuery && (
          <button 
            className="absolute right-2 top-2.5"
            onClick={onClearSearch}
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      <Button 
        variant="outline" 
        size="icon"
        onClick={onRefresh}
        title="Refresh"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
