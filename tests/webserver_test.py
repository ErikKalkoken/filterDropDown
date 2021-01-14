import unittest
import urllib

from webserver import app


class TestWebserver(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_should_open_welcome_page(self):
        # when
        result = self.app.get("/")
        # then
        self.assertEqual(result.status_code, 200)
        self.assertIn("text/html", result.content_type)

    def test_should_return_regular_data(self):
        # when
        result = self.app.get("/data")
        # then
        self.assertEqual(result.status_code, 200)
        self.assertIn("application/json", result.content_type)
        self.assertIn(
            [
                "Tiger Nixon",
                "System Architect",
                "Edinburgh",
                "5421",
                "2011/04/25",
                "$320,800",
            ],
            result.json["data"],
        )

    def test_should_return_columns_for_filter_drop_down_1(self):
        # when
        value = urllib.parse.quote_plus("1,2,0")
        result = self.app.get(f"/data_filter_drop_down_1?columns={value}")
        # then
        self.assertEqual(result.status_code, 200)
        self.assertIn("application/json", result.content_type)
        self.assertIn("1", result.json)
        self.assertIn("Junior Technical Author", result.json["1"])
        self.assertIn("2", result.json)
        self.assertIn("Edinburgh", result.json["2"])
        self.assertIn("0", result.json)
        self.assertIn("Garrett Winters", result.json["0"])

    def test_should_return_columns_for_filter_drop_down_2(self):
        # when
        result = self.app.get("/data_filter_drop_down_2?columns=position,office,name")
        # then
        self.assertEqual(result.status_code, 200)
        self.assertIn("application/json", result.content_type)
        self.assertIn("position", result.json)
        self.assertIn("Junior Technical Author", result.json["position"])
        self.assertIn("office", result.json)
        self.assertIn("Edinburgh", result.json["office"])
        self.assertIn("name", result.json)
        self.assertIn("Garrett Winters", result.json["name"])


if __name__ == "__main__":
    unittest.main()
