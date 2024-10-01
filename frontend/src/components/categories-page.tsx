import { useState } from "react";
import { Search } from "lucide-react";

const categories = [
    { name: "Technology", count: 1250 },
    { name: "Business", count: 980 },
    { name: "Health", count: 756 },
    { name: "Education", count: 543 },
    { name: "Environment", count: 421 },
    { name: "Social Impact", count: 387 },
    { name: "Art & Design", count: 302 },
    { name: "Science", count: 289 },
    { name: "Travel", count: 201 },
    { name: "Food", count: 178 },
];

export function CategoriesPageComponent() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCategories, setFilteredCategories] = useState(categories);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = categories.filter(category => 
            category.name.toLowerCase().includes(term)
        );
        setFilteredCategories(filtered);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                Categories
            </h1>
            <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCategories.map((category, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{category.name}</h2>
                        <p className="text-gray-600">{category.count} ideas</p>
                    </div>
                ))}
            </div>
        </div>
    );
}