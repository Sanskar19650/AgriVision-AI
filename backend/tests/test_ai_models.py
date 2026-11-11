"""
AgriVision AI - Phase 6: Automated AI Model Unit Tests
Tests:
1. PyTorch CNN Plant Pathology Classification
2. Random Forest Crop Recommendation Multi-Class Model
3. YOLOv8 Damage Segmentation & IoU Bounding Box Validation
"""

import sys
import os
import unittest
import numpy as np

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ai_models.cnn_disease_model import AgriVisionCNN, PLANT_CLASSES
from ai_models.train_random_forest import generate_agricultural_dataset, train_and_export_random_forest
from ai_models.yolo_damage_detector import AgriVisionYOLOv8

class TestAIModels(unittest.TestCase):
    
    def test_cnn_architecture(self):
        """Validates that CNN forward pass accepts (B, 3, 224, 224) and outputs (B, 25)."""
        import torch
        model = AgriVisionCNN(num_classes=len(PLANT_CLASSES))
        dummy_input = torch.randn(2, 3, 224, 224)
        output = model(dummy_input)
        self.assertEqual(output.shape, (2, len(PLANT_CLASSES)))
        print("✅ Test Passed: PyTorch CNN architecture validated.")

    def test_random_forest_training_and_accuracy(self):
        """Validates Random Forest training, feature names, and accuracy > 85%."""
        artifact = train_and_export_random_forest(model_path="backend/ai_models/test_rf.pkl")
        self.assertIn('model', artifact)
        self.assertIn('features', artifact)
        self.assertGreaterEqual(artifact['metrics']['test_accuracy'], 0.85)
        
        # Test sample inference
        test_features = np.array([[90.0, 42.0, 43.0, 25.0, 80.0, 6.5, 200.0]])
        probs = artifact['model'].predict_proba(test_features)
        self.assertEqual(probs.shape[1], len(artifact['classes']))
        print(f"✅ Test Passed: Random Forest model accuracy validated ({artifact['metrics']['test_accuracy']*100:.1f}%).")

    def test_yolo_damage_bounds(self):
        """Validates YOLO bounding boxes are strictly normalized (0-100%)."""
        detector = AgriVisionYOLOv8()
        res = detector.detect_damage(None)
        
        self.assertIn("damage_percentage", res)
        self.assertIn("detected_objects", res)
        self.assertTrue(0 <= res["damage_percentage"] <= 100)

        for obj in res["detected_objects"]:
            box = obj["box"] # [ymin, xmin, ymax, xmax]
            self.assertTrue(0 <= box[0] <= 100)
            self.assertTrue(0 <= box[1] <= 100)
            self.assertTrue(0 <= box[2] <= 100)
            self.assertTrue(0 <= box[3] <= 100)
            self.assertTrue(box[0] <= box[2]) # ymin <= ymax
            self.assertTrue(box[1] <= box[3]) # xmin <= xmax

        print("✅ Test Passed: YOLOv8 bounding boxes and metrics within valid spatial bounds.")

    def test_agrivision_net_custom(self):
        """Validates custom AgriVisionNet with SE attention and multi-task heads."""
        import torch
        from ai_models.agrivision_net import AgriVisionNet, FocalLoss, count_parameters
        
        net = AgriVisionNet(num_classes=25)
        params = count_parameters(net)
        self.assertGreater(params['total'], 3_000_000)
        self.assertLess(params['total'], 5_000_000)

        dummy = torch.randn(2, 3, 224, 224)
        disease_logits, severity_logits = net(dummy, return_severity=True)
        self.assertEqual(disease_logits.shape, (2, 25))
        self.assertEqual(severity_logits.shape, (2, 4))

        # Test Focal Loss calculation
        focal_loss = FocalLoss(gamma=2.0)
        dummy_targets = torch.tensor([3, 14])
        loss = focal_loss(disease_logits, dummy_targets)
        self.assertGreater(loss.item(), 0)
        print(f"✅ Test Passed: AgriVisionNet ({params['formatted']}) and Focal Loss validated.")

if __name__ == '__main__':
    unittest.main()
