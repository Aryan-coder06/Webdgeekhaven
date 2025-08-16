import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, ExternalLink, Youtube, Code2, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { questionsAPI } from './services/api';

function App() {
  const [categories, setCategories] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchMode, setSearchMode] = useState(false);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchMode(false);
      setFilteredQuestions([]);
    }
  }, [searchQuery]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await questionsAPI.getAllCategories();
      setCategories(response);
      
      // Auto-expand first category
      if (response.length > 0) {
        setExpandedCategories(new Set([response[0]._id]));
      }
    } catch (err) {
      setError('Failed to load categories. Please make sure your backend server is running on http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setSearchLoading(true);
      const response = await questionsAPI.searchQuestions(searchQuery);
      setFilteredQuestions(response.data);
      setSearchMode(true);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const QuestionCard = ({ question }) => (
    <div className="card fade-in">
      <h4 className="font-medium text-slate-800 mb-3 leading-relaxed">{question.title}</h4>
      
      <div className="flex gap-2" style={{flexWrap: 'wrap'}}>
        {question.url?.yt_link && (
          <a 
            href={question.url.yt_link}
            target="_blank"
            rel="noopener noreferrer"
            className="link-red"
          >
            <Youtube size={14} />
            <span>Video</span>
          </a>
        )}
        
        {question.url?.p1_link && (
          <a 
            href={question.url.p1_link}
            target="_blank"
            rel="noopener noreferrer"
            className="link-blue"
          >
            <Code2 size={14} />
            <span>Problem 1</span>
          </a>
        )}
        
        {question.url?.p2_link && (
          <a 
            href={question.url.p2_link}
            target="_blank"
            rel="noopener noreferrer"
            className="link-green"
          >
            <ExternalLink size={14} />
            <span>Problem 2</span>
          </a>
        )}
      </div>
    </div>
  );

  const CategoryAccordion = ({ category }) => {
    const isExpanded = expandedCategories.has(category._id);
    
    return (
      <div className="accordion fade-in">
        <button
          onClick={() => toggleCategory(category._id)}
          className="accordion-header"
        >
          <div className="flex items-center gap-3">
            <BookOpen size={20} style={{color: '#0284c7'}} />
            <div>
              <h3 className="font-semibold text-slate-800">
                {category.title}
              </h3>
              <p className="text-sm" style={{color: '#64748b', marginTop: '4px'}}>
                {category.questions?.length || 0} questions
              </p>
            </div>
          </div>
          
          <div style={{color: '#94a3b8'}}>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
        
        {isExpanded && (
          <div className="accordion-content">
            <div className="pt-4 space-y-3 slide-down">
              {category.questions?.map((question) => (
                <QuestionCard key={question._id} question={question} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin mx-auto mb-4" style={{color: '#0284c7'}} />
          <p className="text-slate-600">Loading your question feast...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <AlertCircle size={48} className="mx-auto mb-4" style={{color: '#ef4444'}} />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Connection Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={loadCategories}
            className="btn-primary px-6 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              🍽️ Frontend Feast
            </h1>
            <p className="text-slate-600">The Interactive Q&A Explorer</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute" style={{left: '16px', top: '50%', transform: 'translateY(-50%)'}}>
              <Search size={20} style={{color: '#94a3b8'}} />
            </div>
            <input
              type="text"
              placeholder="Search for questions... (try 'linkedlist', 'array', 'tree')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{paddingLeft: '48px', paddingRight: '16px'}}
            />
            {searchLoading && (
              <div className="absolute" style={{right: '16px', top: '50%', transform: 'translateY(-50%)'}}>
                <Loader2 size={20} className="animate-spin" style={{color: '#94a3b8'}} />
              </div>
            )}
          </div>
          
          {searchMode && (
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-600">
                Found {filteredQuestions.length} result{filteredQuestions.length !== 1 ? 's' : ''} for "{searchQuery}"
                <button 
                  onClick={() => {setSearchQuery(''); setSearchMode(false);}}
                  className="ml-2 underline"
                  style={{color: '#0284c7'}}
                >
                  Clear search
                </button>
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {searchMode ? (
          /* Search Results */
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Search Results</h2>
            {filteredQuestions.length > 0 ? (
              <div className="space-y-3">
                {filteredQuestions.map((question) => (
                  <QuestionCard key={question._id} question={question} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto mb-4" style={{color: '#cbd5e1'}} />
                <p style={{color: '#64748b'}}>No questions found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          /* Categories Accordion */
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Question Categories</h2>
              <p className="text-sm text-slate-600">{categories.length} categories available</p>
            </div>
            
            {categories.map((category) => (
              <CategoryAccordion key={category._id} category={category} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container py-8 text-center">
          <p className="text-slate-600">
            Built with ❤️ using React + Vite + Custom CSS
          </p>
          <p className="text-sm mt-2" style={{color: '#64748b'}}>
            Connected to backend API at localhost:5000
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
