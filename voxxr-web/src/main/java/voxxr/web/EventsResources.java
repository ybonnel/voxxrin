package voxxr.web;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * User: xavierhanin
 * Date: 1/28/12
 * Time: 8:51 PM
 */
public class EventsResources extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.addHeader("Content-Type", "application/json");
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.getWriter().write("[" +
                "{" +
                "\"id\":\"1\"," +
                "\"title\":\"BordeauxJUG\"," +
                "\"subtitle\":\"Soiree Voxxr / Neo4j\"," +
                "\"nbTalks\":2," +
                "\"dates\":\"Apr 12, 2012\"" +
                "}" +
                "]");
    }
}
