#!/usr/bin/env python3
"""
Test script to verify KrushiAI application components
"""

def test_imports():
    """Test all required imports"""
    print("Testing imports...")
    try:
        import streamlit as st
        print("✅ Streamlit imported successfully")
        
        import tensorflow as tf
        print("✅ TensorFlow imported successfully")
        
        import cv2
        print("✅ OpenCV imported successfully")
        
        import plotly
        print("✅ Plotly imported successfully")
        
        from streamlit_option_menu import option_menu
        print("✅ Streamlit Option Menu imported successfully")
        
        import utils
        print("✅ Utils module imported successfully")
        
        import disease_info
        print("✅ Disease Info module imported successfully")
        
        assert True
    except Exception as e:
        print(f"❌ Import error: {e}")
        assert False

def test_disease_database():
    """Test disease database"""
    print("\nTesting disease database...")
    try:
        from disease_info import get_disease_info, get_all_diseases, get_severity_stats
        
        diseases = get_all_diseases()
        print(f"✅ Found {len(diseases)} diseases in database")
        
        stats = get_severity_stats()
        print(f"✅ Severity statistics: {stats}")
        
        # Test a specific disease
        sample_info = get_disease_info('Apple___Apple_scab')
        print(f"✅ Sample disease info retrieved: {sample_info['name']}")
        
        assert True
    except Exception as e:
        print(f"❌ Database error: {e}")
        assert False

def test_model_components():
    """Test model-related components"""
    print("\nTesting model components...")
    try:
        from utils import ImageProcessor, format_disease_name, get_severity_color
        
        processor = ImageProcessor()
        print("✅ Image processor created successfully")
        
        formatted_name = format_disease_name("Apple___Apple_scab")
        print(f"✅ Disease name formatting: {formatted_name}")
        
        color = get_severity_color("High")
        print(f"✅ Severity color mapping: {color}")
        
        assert True
    except Exception as e:
        print(f"❌ Model component error: {e}")
        assert False

def main():
    """Run all tests"""
    print("🌿 KrushiAI Application Test Suite")
    print("=" * 40)
    
    tests = [
        test_imports,
        test_disease_database,
        test_model_components
    ]
    
    passed = 0
    for test in tests:
        try:
            test()
            passed += 1
        except Exception as e:
            print(f"❌ Test failed with error: {e}")
    
    print("\n" + "=" * 40)
    print(f"Tests passed: {passed}/{len(tests)}")
    
    if passed == len(tests):
        print("🎉 All tests passed! Application is ready to run.")
        print("\nTo start the application, run:")
        print("streamlit run main.py")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")

if __name__ == "__main__":
    main()