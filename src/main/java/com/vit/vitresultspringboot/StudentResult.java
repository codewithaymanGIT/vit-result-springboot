package com.vit.vitresultspringboot;

import jakarta.persistence.*;

@Entity
@Table(name = "student_result")
public class StudentResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String regNumber;

    private double mse1;
    private double ese1;
    private double mse2;
    private double ese2;
    private double mse3;
    private double ese3;
    private double mse4;
    private double ese4;

    private double totalWeighted;
    private double percentage;
    private String grade;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRegNumber() { return regNumber; }
    public void setRegNumber(String regNumber) { this.regNumber = regNumber; }

    public double getMse1() { return mse1; }
    public void setMse1(double mse1) { this.mse1 = mse1; }

    public double getEse1() { return ese1; }
    public void setEse1(double ese1) { this.ese1 = ese1; }

    public double getMse2() { return mse2; }
    public void setMse2(double mse2) { this.mse2 = mse2; }

    public double getEse2() { return ese2; }
    public void setEse2(double ese2) { this.ese2 = ese2; }

    public double getMse3() { return mse3; }
    public void setMse3(double mse3) { this.mse3 = mse3; }

    public double getEse3() { return ese3; }
    public void setEse3(double ese3) { this.ese3 = ese3; }

    public double getMse4() { return mse4; }
    public void setMse4(double mse4) { this.mse4 = mse4; }

    public double getEse4() { return ese4; }
    public void setEse4(double ese4) { this.ese4 = ese4; }

    public double getTotalWeighted() { return totalWeighted; }
    public void setTotalWeighted(double totalWeighted) { this.totalWeighted = totalWeighted; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
}