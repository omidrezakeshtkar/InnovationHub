import pytest
import sys
import os

def setup_test_environment():
    # Set environment variables for testing
    os.environ['SECRET_KEY'] = 'test_secret_key'
    os.environ['DATABASE_URL'] = 'sqlite:///./test.db'
    os.environ['ALGORITHM'] = 'HS256'
    os.environ['ACCESS_TOKEN_EXPIRE_MINUTES'] = '30'
    
    # Add more environment variables as needed for testing
    # os.environ['SOME_API_KEY'] = 'test_api_key'

if __name__ == "__main__":
    # Setup test environment
    setup_test_environment()
    
    # Add the parent directory to the Python path
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # Run pytest with optional arguments
    args = ["-v", "-s"] + sys.argv[1:]
    pytest.main(args)