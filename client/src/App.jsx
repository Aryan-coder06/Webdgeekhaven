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
      
      // Auto-expand first few categories to show more questions
      if (response.length > 0) {
        const expandedIds = response.slice(0, 3).map(cat => cat._id); // Expand first 3 categories
        setExpandedCategories(new Set(expandedIds));
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

  const QuestionCard = ({ question }) => {
    const [showLinks, setShowLinks] = useState(false);

    const linkCards = [
      {
        key: 'youtube',
        url: question.url?.yt_link,
        title: 'Watch Tutorial',
        subtitle: 'YouTube Video',
        icon: <Youtube size={24} />,
        bgGradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
        hoverBgGradient: 'linear-gradient(135deg, #dc2626, #b91c1c)',
        description: 'Step-by-step video explanation'
      },
      {
        key: 'problem1',
        url: question.url?.p1_link,
        title: 'Practice Problem',
        subtitle: 'Platform 1',
        icon: <Code2 size={24} />,
        bgGradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        hoverBgGradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        description: 'Solve on coding platform'
      },
      {
        key: 'problem2',
        url: question.url?.p2_link,
        title: 'Alternative Practice',
        subtitle: 'Platform 2',
        icon: <ExternalLink size={24} />,
        bgGradient: 'linear-gradient(135deg, #10b981, #059669)',
        hoverBgGradient: 'linear-gradient(135deg, #059669, #047857)',
        description: 'Try different platform'
      }
    ];

    const availableLinks = linkCards.filter(link => link.url && link.url.trim() !== '');

    return (
      <div className="card fade-in">
        <h4 className="font-medium text-slate-800 mb-3 leading-relaxed">{question.title}</h4>
        
        {/* Show small link indicators */}
        <div className="flex gap-2 mb-3" style={{flexWrap: 'wrap'}}>
          {question.url?.yt_link && question.url.yt_link.trim() !== '' && (
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
          
          {question.url?.p1_link && question.url.p1_link.trim() !== '' && (
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
          
          {question.url?.p2_link && question.url.p2_link.trim() !== '' && (
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
        
        {/* Toggle Button for Colorful Boxes */}
        {availableLinks.length > 0 && (
          <button
            onClick={() => setShowLinks(!showLinks)}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 8px 15px -3px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            <BookOpen size={16} />
            <span>{showLinks ? 'Hide' : 'Show'} Detailed Resources ({availableLinks.length})</span>
            <div style={{
              transform: showLinks ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>
              <ChevronDown size={16} />
            </div>
          </button>
        )}

        {/* Colorful Link Boxes */}
        {showLinks && (
          <div 
            className="slide-down" 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}
          >
            {availableLinks.map((link) => (
              <a
                key={link.key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: link.bgGradient,
                  color: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = link.hoverBgGradient;
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = link.bgGradient;
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                    <div style={{
                      padding: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {link.icon}
                    </div>
                    <div>
                      <h5 style={{fontSize: '1.125rem', fontWeight: '600', margin: 0}}>{link.title}</h5>
                      <p style={{fontSize: '0.875rem', opacity: 0.9, margin: 0}}>{link.subtitle}</p>
                    </div>
                  </div>
                  <div style={{opacity: 0.6}}>
                    <ExternalLink size={20} />
                  </div>
                </div>
                
                <p style={{
                  fontSize: '0.875rem',
                  opacity: 0.8,
                  lineHeight: 1.6,
                  margin: 0,
                  marginBottom: '1rem'
                }}>{link.description}</p>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  opacity: 0.9
                }}>
                  <span>Click to open</span>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }}></div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card text-center p-8">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-glass font-medium text-lg">Loading your question feast...</p>
          <div className="mt-4">
            <div className="pulse" style={{color: 'rgba(255, 255, 255, 0.6)'}}>
              ✨ Preparing something magical ✨
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="error-state max-w-md mx-auto">
          <AlertCircle size={48} className="mx-auto mb-4" style={{color: '#ff6b6b'}} />
          <h2 className="text-xl font-semibold text-glass mb-2">🚫 Connection Error</h2>
          <p className="text-glass-secondary mb-6">{error}</p>
          <button 
            onClick={loadCategories}
            className="neon-btn"
          >
            ✨ Try Again ✨
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="hero-header shadow-lg sticky top-0 z-10">
        <div className="container py-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white glow-text mb-2">
              🚀 Frontend Feast
            </h1>
            <p className="text-glass-secondary text-lg font-medium">The Interactive Q&A Explorer ✨</p>
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
              <p className="text-sm text-glass-secondary">
                Found {filteredQuestions.length} result{filteredQuestions.length !== 1 ? 's' : ''} for "{searchQuery}"
                <button 
                  onClick={() => {setSearchQuery(''); setSearchMode(false);}}
                  className="ml-2 underline text-glass hover:text-white transition-colors"
                >
                  Clear search ✨
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
